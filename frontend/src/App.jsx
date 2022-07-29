import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { ProfileData } from "./components/ProfileData";
import { callMsGraph } from "./graph";
import Button from "react-bootstrap/Button";
import "./styles/App.css";
import axios from 'axios';

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const [editAccess, setEditAccess] = useState(false);
    const [textFromApi, setTextFromApi] = useState("");

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            console.log(response);
            if (response.idTokenClaims.roles?.length) {
                response.idTokenClaims.roles[0] === "PI.Developer" ? setEditAccess(true) : setEditAccess(false);
            } else {
                setEditAccess(false)
            }
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        });
    }

    const editStyle = {
        "cursor": editAccess ? "auto" : "default",
        "opacity": editAccess ? 1 : 0.5,
        "pointerEvents": editAccess ? "auto" : "none"
    }

    function callPythonPost() {
        axios.post("https://react-python-sample.herokuapp.com/flask/hello/", { message: "Hi, this is message from Python POST Method", type: "String" })
            .then(response => {
                console.log("post success: ", response)
                setTextFromApi(response.data.message);
            })
            .catch(err => console.error(`Error: ${err}`))
    }

    return (
        <>
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            {graphData ?
                <ProfileData graphData={graphData} />
                :
                <Button variant="secondary" onClick={RequestProfileData}>Request Profile Information</Button>
            }
            <h5>If you have access, then you can edit the following text box</h5>
            <div>
                <input placeholder="Enter some text" style={editStyle}></input>
            </div>
            <div>
                <button onClick={callPythonPost}>Call Sample Python POST call</button>
                {textFromApi.length !== 0 ? <h5>{textFromApi}</h5> : <></>}
            </div>
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
