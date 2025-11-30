"use client";

import { motion } from "framer-motion";

export const ScrollIndicator = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 z-50"
        >
            <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>
    );
};
