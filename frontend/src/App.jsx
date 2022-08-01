import React, { useState, useEffect } from "react";
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
    const [sum, setSum] = useState(0);
    const [num1, setNum1] = useState(5);
    const [num2, setNum2] = useState(6);

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

    // useEffect(() => {
    //     setNum1(num1);
    //     setNum2(num2);

    // }, [])

    const editStyle = {
        "cursor": editAccess ? "auto" : "default",
        "opacity": editAccess ? 1 : 0.5,
        "pointerEvents": editAccess ? "auto" : "none"
    }

    function getSumOfTwoNos() {
        axios.post("https://react-python-sample.herokuapp.com/sum", { num1, num2 })
            .then(response => {
                console.log("post success: ", response)
                setSum(response.data.result);
            })
            .catch(err => console.error(`Error: ${err}`))
    }

    function changeInput(e, label) {
        switch (label) {
            case "num1":
                setNum1(e.target.value);
                break;
            case "num2":
                setNum2(e.target.value);
                break;
            default:
        }
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
                <input placeholder="Enter some number" style={editStyle} onChange={(e) => changeInput(e, "num1")} value={num1}></input>
                <input placeholder="Enter some number" style={editStyle} onChange={(e) => changeInput(e, "num2")} value={num2}></input>
                <button onClick={getSumOfTwoNos}>Get Sum from Server</button>
            </div>
            <br></br>
            <h5>Sum: {sum}</h5>
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {

    const [message, setMessage] = useState("")

    useEffect(() => {
        axios.get("https://react-python-sample.herokuapp.com/hello")
            .then(response => {
                console.log("post success: ", response)
                setMessage(response.data.message);
            })
            .catch(err => console.error(`Error: ${err}`))
    }, [])
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
            {message.length !== 0 ? <h5>{message}</h5> : <></>}
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
