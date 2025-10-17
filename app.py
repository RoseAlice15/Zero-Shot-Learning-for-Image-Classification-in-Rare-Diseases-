from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from clip_zeroshot import classify_disease
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/classify', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to avoid filename conflicts
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Classify the image
        try:
            logger.info(f"Classifying image: {filename}")
            result = classify_disease(filepath)
            return jsonify(result)
        except Exception as e:
            logger.error(f"Classification error: {str(e)}")
            return jsonify({'error': f'Classification error: {str(e)}'}), 500
        finally:
            # Clean up uploaded file after processing
            try:
                os.remove(filepath)
            except:
                pass
    
    return jsonify({'error': 'Invalid file type. Please upload an image file (PNG, JPG, JPEG, BMP, TIFF)'}), 400

@app.route('/diseases', methods=['GET'])
def get_diseases():
    """Return list of all diseases in the database"""
    try:
        from clip_zeroshot import disease_names
        return jsonify({'diseases': disease_names})
    except Exception as e:
        logger.error(f"Error getting diseases: {str(e)}")
        return jsonify({'error': 'Could not retrieve disease list'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)