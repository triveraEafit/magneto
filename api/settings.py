import pytesseract
from django.conf import settings

pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD