import React, { useState } from 'react';

import Message from './components/Message';

import "./App.css"

const App = () => {
    const [playerIdChat, setPlayerIdChat] = useState('');
    const [apiKeyChat, setApiKeyChat] = useState('gaggle-ggd-onetruekey@3123@0-+213!nsUEJAmd82$88ska2s923?!1-bartender');
    const [contentChat, setContentChat] = useState('');
    const [errors, setErrors] = useState([]);  // Use array for errors
    const [is4, setIs4] = useState(false)

    const [userData, setUserData] = useState('golden armor, long sleek platinum colored sword, radiant feathers and green tips. long beak.')
    const [pronouns, setProunouns] = useState('he/him')
    const [trustLevel, setTrustLevel] = useState('')

    const [npcIdChat, setNpcIdChat] = useState('');

    const [receivedMessages, setReceivedMessages] = useState([])
    const [sentMessages, setSentMessages] = useState([])

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);  // Add this line

    const allMessages = [...sentMessages, ...receivedMessages].sort((a, b) => a.id - b.id);

    const handleChat = async () => {
        let openai_model = ""
        // const validNpcIDs = ['demo-npc1', 'demo-npc2', 'demo-npc3', 'demo-npc4', 'demo-npc5'];
        // if (!validNpcIDs.includes(npcIdChat)) {
        //     alert("Invalid NPC ID!"); // Or handle this in a way that fits your UI/UX
        //     return;
        // }

        setSentMessages(prev => [...prev, { id: sentMessages.length, content: contentChat, isSender: true }]);
        setErrors([])
        setReceivedMessages(prev => [...prev, { id: receivedMessages.length, content: '', isSender: false }]); // initialize new received message
        setIsLoading(true);  // Set isLoading to true
        if(is4){
          openai_model = 'gpt-4-1106-preview'
        }

        try {
          // const response = await fetch('http://127.0.0.1:8000/api/demo/chat', {
            // const response = await fetch('http://127.0.0.1:8000/api/chat', {
        // const response = await fetch('https://bartender-api.mutuai.io/api/demo/chat', {
          const response = await fetch('https://bartender-api.mutuai.io/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + apiKeyChat,
            },
            body: JSON.stringify({ player_id: playerIdChat, npc_id: npcIdChat, 
                                  content: contentChat, openai_model, pronouns,
                                  trust_level: trustLevel,
                                  user_data: userData})
          });
    
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
    
          let remainder = '';
    
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
    
          reader.read().then(function processStream({ done, value }) {
            let chunk = decoder.decode(value, { stream: true });
            chunk = remainder + chunk;
            let endLineIndex;
    
            while ((endLineIndex = chunk.indexOf('\n')) >= 0) {
              let line = chunk.slice(0, endLineIndex);
    
              if (line.trim() !== '') {
                try {
                  let data = JSON.parse(line);
                  let content = data['content'];
                  let error = data['error'];
    
                  if (content == "[close]") {
                    setIsLoading(false);
                    return;
                  }
    
                  if (error) {
                    setErrors(prevErrors => [...prevErrors, error]);
                  } else {
                    setReceivedMessages(prev => {
                      const lastMsgIndex = prev.length - 1;
                      const lastMsg = prev[lastMsgIndex];
                      const updatedMsg = { ...lastMsg, content: lastMsg.content + content };
                      const updatedMsgs = [...prev];
                      updatedMsgs[lastMsgIndex] = updatedMsg;
                      return updatedMsgs;
                    });
                  }
                } catch (err) {
                  console.log(err);
                  setIsLoading(false);
                }
              }
              chunk = chunk.slice(endLineIndex + 1);
            }
            remainder = chunk;
    
            if (!done) {
              return reader.read().then(processStream);
            }
          }).catch(error => {
            console.error(error);
          });
    
        } catch (error) {
          console.error(error);
        }
      }    

    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%"
    }}>
        <div style={{
            position: "relative",
            width: "100%"
        }}>
            <div style={{
                position: "absolute",
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                AVAILABLE NPCS:
                <span style={{
                    color: "blue",
                    // height: "100px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                <div>
                  demo-npc1
                </div>
                <div>
                demo-npc2
                </div>
                <div>
                demo-npc3
                </div>
                <div>
                demo-npc4
                </div>
                <div>
                demo-npc5
                </div>
                </span>
            </div>
            <h1 style={{
                width: "100%",
                textAlign: "center",
                color: "maroon"
            }}>Bartender Demo</h1>
        </div>
            

            <div style={{
                width: "80%",
                height: "80%",
                overflow: "scroll"
            }}>
                <div>
                    {allMessages.map((message) =>
                        <Message key={message.id + "-" + message.isSender} data={message.content} isSender={message.isSender} />
                    )}
                </div>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%"
            }}>
                 <div
                    onMouseEnter={() => setTooltipOpen(true)}
                    onMouseLeave={() => setTooltipOpen(false)}
                    style={{ position: 'relative', color: "maroon" }} // set the div position as relative
                >
                    BARTENDER INFO:
                    {tooltipOpen && 
                        <div style={{
                            position: 'absolute', // tooltip will be absolutely positioned 
                            backgroundColor: 'white',
                            border: '1px solid black',
                            display: 'flex',
                            padding: '10px',
                            flexDirection: "column",
                            textAlign: 'center',
                            borderRadius: '5px',
                            bottom: '-20px', // adjust this as per your needs
                            left: '0',
                            zIndex: '10' // make sure the tooltip appears above all other elements
                        }}>
                            <div style={{
                                paddingTop: "10px",
                                color: "black"
                            }}>
                                How to use:
                                <div style={{
                                  color: "gray"
                                }}>
                                    Type in your player_id, can be anything you want.
                                    Then choose the available npcs.
                                    Send your message.
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <label>Player ID:</label><br />
                    <input type="text" value={playerIdChat} onChange={(e) => setPlayerIdChat(e.target.value)} /><br />
                </div>
                
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <label>NPC ID:</label><br />  {/* Add input field for NPC ID */}
                    <input type="text" value={npcIdChat} onChange={(e) => setNpcIdChat(e.target.value)} /><br />
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <label>Content:</label><br />
                    <input type="text" value={contentChat} onChange={(e) => setContentChat(e.target.value)} /><br />
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <label>Pronouns:</label><br />
                    <input type="text" value={pronouns} onChange={(e) => setProunouns(e.target.value)} /><br />
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <label>User Data:</label><br />
                    <input type="text" value={userData} onChange={(e) => setUserData(e.target.value)} /><br />
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <label>Trust Level:</label><br />
                    <input type="text" value={trustLevel} onChange={(e) => setTrustLevel(e.target.value)} /><br />
                </div>
                
                <div>
                  <button style={{
                    marginRight: '10px'
                  }}  onClick={handleChat} disabled={isLoading}>  {/* Disable button if loading */}
                      {isLoading ? "Loading..." : "Chat"}  {/* Change button text if loading */}
                  </button>

                  <button onClick={()=> setIs4(prev => !prev)}>
                      {!is4 ? <>
                        gpt-3.5-turbo
                      </> :
                      <>
                        gpt-4
                      </>
                      }
                  </button>
                </div>

            </div>

        </div>
    )
}

export default App;
