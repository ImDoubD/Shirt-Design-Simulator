// import React from 'react'
import { motion,AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { 
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation 
} from '../config/motion';

import state  from '../store';
import { CustomButton } from '../components';

const Home = () => {
    const snap = useSnapshot(state);
  return (
    <AnimatePresence>
        {snap.intro && (
            <motion.section className="home" {...slideAnimation('left')}>
                <motion.header {...slideAnimation('down')}>
                    <img
                        src='./threejs.png'
                        alt="logo"
                        className="w-8 h-8 object-contain"
                    >
                    </img>
                </motion.header>
                <motion.div className="home-content" {...headContainerAnimation}>
                    <motion.div {...headTextAnimation}>
                        <h1 className="head-text">
                            <p className="">LES <br className="xl:block hidden"/> DO IT!!</p>
                            {/* LES <br className="xl:block hidden"/> DO IT!! */}
                        </h1>
                    </motion.div>
                    <motion.div className="flex flex-col gap-5"  {...headContentAnimation}>
                        <p className="max-w-md font-normal  text-base">
                        Experience the epitome of personal style with our cutting-edge 3D customization tool. 
                        Let your creativity soar as you design your unique, exclusive shirt. 
                        <strong> UNLEASE YOUR IMAGINATION</strong>{" "} and define a fashion statement that's truly yours.
                        </p>

                        <CustomButton 
                            type="filled"
                            title="Customize it" 
                            handleClick={()=> state.intro = false}
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        >
                        </CustomButton>
                    </motion.div>
                </motion.div>
            </motion.section>
        )}
    </AnimatePresence>
  )
}

export default Home
