import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function DataMetricsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const metrics = [
        {
            value: "3.5h",
            label: "Średnio tyle godzin tygodniowo odzyskuje jeden pracownik dzięki automatyzacji powtarzalnych zadań."
        },
        {
            value: "100%",
            label: "Tyle darmowych rekomendacji wdrażamy po pierwszej konsultacji."
        },
        {
            value: "0",
            label: "Dni przestoju w Twojej firmie podczas naszych wdrożeń."
        }
    ];

    const blurRevealVariants = {
        hidden: { opacity: 0, filter: "blur(20px)", y: 40 },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: { duration: 1.2, ease: "easeOut" }
        }
    };

    return (
        <section className="py-32 bg-navy text-white relative overflow-hidden flex flex-col justify-center">

            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-[1400px] w-full mx-auto px-6 max-md:px-4 relative z-10" ref={ref}>

                <div className="mb-24 flex justify-center">
                    <motion.h2
                        variants={blurRevealVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold font-display tracking-tighter text-center max-w-4xl"
                    >
                        Liczby nie mają opinii.<br />
                        <span className="text-chartreuse">One po prostu rosną.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">

                    {metrics.map((metric, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, delay: 0.4 + (idx * 0.2), type: "spring", stiffness: 100 }}
                            className={`flex flex-col items-center text-center ${idx !== 0 ? 'pt-12 md:pt-0' : ''}`}
                        >
                            <div className="text-7xl lg:text-8xl xl:text-9xl font-bold font-display tracking-tighter text-white mb-6">
                                {metric.value}
                            </div>
                            <p className="text-lg text-slate-400 max-w-xs font-medium leading-relaxed">
                                {metric.label}
                            </p>
                        </motion.div>
                    ))}

                </div>

            </div>
        </section>
    );
}
