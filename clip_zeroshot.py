import torch
import clip
from PIL import Image
import json
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Loading CLIP model on device: {device}")

try:
    model, preprocess = clip.load("ViT-B/32", device=device)
    logger.info("CLIP model loaded successfully")
except Exception as e:
    logger.error(f"Error loading CLIP model: {str(e)}")
    raise e

# Load disease descriptions
try:
    # Get the absolute path to the disease_descriptions.json file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    disease_file_path = os.path.join(current_dir, 'disease_descriptions.json')
    
    with open(disease_file_path, 'r') as f:
        disease_data = json.load(f)
    logger.info(f"Loaded {len(disease_data)} diseases from database")
except Exception as e:
    logger.error(f"Error loading disease descriptions: {str(e)}")
    # Create empty data to prevent crash
    disease_data = {}
    logger.warning("Using empty disease database - classification will not work properly")

disease_names = list(disease_data.keys())
disease_descriptions = [disease_data[name]['description'] for name in disease_names]

def classify_disease(image_path):
    try:
        # Check if we have diseases loaded
        if not disease_data:
            return {'error': 'Disease database not loaded', 'predictions': []}
            
        # Load and preprocess image
        image = Image.open(image_path)
        image_input = preprocess(image).unsqueeze(0).to(device)
        
        # Prepare text inputs
        text_inputs = torch.cat([clip.tokenize(f"a photo of {desc}") for desc in disease_descriptions]).to(device)
        
        # Calculate features
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            text_features = model.encode_text(text_inputs)
            
        # Pick the top 5 most similar labels for the image
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)
        similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
        values, indices = similarity[0].topk(5)
        
        # Prepare results
        results = []
        for value, index in zip(values, indices):
            disease_name = disease_names[index]
            results.append({
                'disease': disease_name,
                'confidence': round(value.item() * 100, 2),
                'description': disease_data[disease_name]['description'],
                'symptoms': disease_data[disease_name]['symptoms'],
                'treatment': disease_data[disease_name]['treatment'],
                'prevalence': disease_data[disease_name].get('prevalence', 'Unknown')
            })
        
        return {'predictions': results}
    
    except Exception as e:
        logger.error(f"Error during classification: {str(e)}")
        raise e