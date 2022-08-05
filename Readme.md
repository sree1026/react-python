# React-Python Project using FastApi
This is a simple prototype project to use React with Python server using FastApi
- React is used as front end
- Python with FastApi is used as backend

## Usage
1. Make sure python and pip is installed in your system
2. Run ```pip install pipenv``` to install `pipenv` tool for creating virtural environments and installing python packages
3. Create virtual environment from root directory by creating a folder **".venv"** parallel to **Pipfile**
4. Run ```pipenv shell``` to spawn virtual environment
5. If virtual environment is not launched then try running ```Source .venv/Scripts/activate``` to activate the virtual environment
6. Run ```deactivate``` to deactivate the virtual environment
7. Run ```pipenv install Pipfile``` to install required python packages for this project
8. Run ```uvicorn app:app --reload``` to run the python fastApi server on localhost:8000
9. The server will server static files from the build folder inside frontend folder so navigating to localhost:8000 in browser will render the production ready react app 
10. Create a new terminal without virtual environment and Navigate to **frontend** folder and run ```npm install``` to install packages required to run the react app
11. Run ```npm start``` to launch the development server
12. App will be served on the specified localhost port