d:
cd D:\videoproject\MoneyPrinterTurbo
conda activate MoneyPrinterTurbo
webui.bat 
conda deactivate MoneyPrinterTurbo




d:
cd D:\rengongTools\poetryTTS
# conda create -n poetry_tts python=3.8


d:
cd D:\videoproject\story-flicks\frontend
conda activate story-flicks
npm install
npm run dev



f:
cd F:\ace_step
conda activate ace_step

python app.py

F:\AI-Media2Doc\frontend
powershell -ExecutionPolicy Bypass -Command "npm install"
powershell -ExecutionPolicy Bypass -Command "npm run dev"

http://localhost:5173/


# clone DreamO repo
git clone https://github.com/bytedance/DreamO.git

f:

cd DreamO
# create conda env
conda create --name dreamo python=3.10
# activate env
conda activate dreamo
# install dependent packages
pip install -r requirements.txt

python app.py