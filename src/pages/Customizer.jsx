// import React , { useState , useEffect } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import { useSnapshot } from 'valtio'

// import config from '../config/config'
// import state from '../store'
// import { download } from '../assets'
// import { downloadCanvasToImage, reader } from '../config/helpers'
// import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
// import { fadeAnimation, slideAnimation } from '../config/motion'

// import { AIpicker, Filepicker, Colorpicker, CustomButton, Tab } from '../components'

// const Customizer = () => {
//   const snap = useSnapshot(state);
//   const [file, setFile] = useState('');
//   const [aiPrompt, setAiPrompt] = useState('');
//   const [generatingImg, setGeneratingImg] = useState(false);
//   const [activeEditorTab, setActiveEditorTab] = useState('');
//   const [activeFilterTab, setActiveFilterTab] = useState({
//     logoShirt : true,  
//     stylishShirt : false,  
//   })
  
//   //show tab content depending on the activeTab
//   const generateTabContent = () => {
//     switch(activeEditorTab) {
//       case "colorpicker":
//         return <Colorpicker/>;
//       case "filepicker":
//         return <Filepicker
//           file={file}
//           setFile={setFile}
//           readFile={readFile}
//         />;
//       case "aipicker":
//         return <AIpicker/>;
//       default:
//         return null;
//     }
//   }

//   const handleDecals = (tyep, result) => {
//     const decalType = DecalTypes[types];
    
//     state[decalType.stateProperty] = result;

//     if(!activeFilterTab[decalType.filterTab]) {
//       handleActiveFilterTab(decalType.filterTab);
//     }
//   }

//   const handleActiveFilterTab = (tabName) => {
//     switch(tabName) {
//       case "logoShirt":
//         state.isLogoText = !activeFilterTab[tabName];
//       break;
//       case "stylishShirt":
//         state.isFullText = !activeFilterTab[tabName];
//       break;
//       default:
//         state.isFullText = false;
//         state.isLogoText = true;
//     }
    
//   };


//   //to get file data
//   const readFile = (type) =>{
//     reader(file)
//       .then((result) => {
//         handleDecals(type,result);
//         setActiveEditorTab("");
//       });
//   };



//   return (
//     <AnimatePresence>
//       {!snap.intro && (
//         <>
//           <motion.div
//             key="custom"
//             className="absolute top-0 left-0 z-10"
//             {...slideAnimation('left')}
//           >
//             <div className='flex items-center min-h-screen'>
//               <div className='editortabs-container tabs'>
//                 {EditorTabs.map((tab)=>(
//                   <Tab
//                     key={tab.name}
//                     tab={tab}
//                     handleClick={() => setActiveEditorTab(tab.name)}
//                   />
//                 ))}

//                 {generateTabContent()}

//               </div>
//             </div>
//           </motion.div>
//           <motion.div
//             className='absolute z-10 top-5 right-5'
//             {...fadeAnimation}
//           >
//             <CustomButton
//               type="filled"
//               title="Go Back"
//               handleClick={()=> state.intro = true}
//               customStyles="w-fit px-4 py-2.5 font-bold text-sm"
//             />
//           </motion.div>
//           <motion.div
//             className='filtertabs-container'
//             {...slideAnimation('up')}
//           >
//             {FilterTabs.map((tab)=>(
//               <Tab
//                 key={tab.name}
//                 tab={tab}
//                 isFilterTab
//                 isActiveTab=""
//                 handleClick={()=>{}}
//               />
//             ))}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   )
// }

// export default Customizer
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config";

import state from "../store";
import { download, stylishShirt } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  CustomButton,
  AIpicker,
  Filepicker,
  Colorpicker,
  Tab,
} from "../components";

function Customizer() {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  // activeEditorTab is for the change in the editor tabs
  const [activeEditorTab, setActiveEditorTab] = useState("");

  // activefilterTab is for the filtering of the textures..
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <Colorpicker />;
      case "filepicker":
        return <Filepicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIpicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
          // alert("Sorry For The Inconvinience!!. The AI is currently expired.")
          // break;
          );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) =>{
    if(!prompt) return alert("Enter a prompt!!");

    try{ //call backend to generate an ai image
      setGeneratingImg(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle' , {
        method: 'POST', //since data is also needed so its a post response
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })


      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`)

    }catch(error){
      alert(error)
    }finally{
      setGeneratingImg(false);
      setActiveEditorTab("");
    }

  }


  // Hanlde the handleDecals()..
  const handleDecals = (type, result) => {
    // Either decalType is logo, full
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  // handling handleActiveFilterTab()
  // Working-principle-> To change isLogoTexture property to alternative value
  // so that why you click one filterTab the other one is switch-off by setting that property to false..
  const handleActiveFilterTab = (tabName) => {
    // Here am alternating the logo-texture in the state.
    switch (tabName) {
      case "logoShirt":
        state.isLogoText = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullText = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoText = true;
        state.isFullText = false;
    }
    //after setting state, set activeFilterTab to set UI
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName] : !prevState[tabName]
      }
    })
    // setActiveFilterTab((prevState) => {
    //   return {
    //     ...prevState,
    //     [tabName]: !prevState[tabName],
    //   };
    // });
  };

  // After setting the state, activeFilterTab is updated..

  // It is used to read the file-> t-shirt color and syle
  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <>
      <AnimatePresence>
        {!snap.intro && (
          <>
            {/* THIS IS FOR THE SIDE OF THE 3 TABS */}
            <motion.div
              key="custom"
              className="absolute top-0 left-0 z-10"
              {...slideAnimation("left")}
            >
              <div className="flex items-center min-h-screen">
                <div className="editortabs-container tabs">
                  {EditorTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => {
                        setActiveEditorTab(tab.name);
                      }}
                    />
                  ))}

                  {generateTabContent()}
                </div>
              </div>
            </motion.div>

            {/* THIS IS FOR THE "GO BACK" BUTTON */}
            <motion.div
              className="absolute z-10 top-5 right-5 "
              {...fadeAnimation}
            >
              <CustomButton
                type="filled"
                title="Go Back"
                handleClick={() => (state.intro = true)}
                customStyle="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>

            {/* THIS ONE FOR THE BELOW TOGGLE BUTTON */}
            <motion.div
              className="filtertabs-container"
              {...slideAnimation("up")}
            >
              {FilterTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={()=> handleActiveFilterTab(tab.name)}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Customizer;