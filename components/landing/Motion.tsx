"use client";

import * as React from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";

export function FadeIn(props: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: props.delay ?? 0 },
    },
  };

  return (
    <motion.div
      className={props.className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {props.children}
    </motion.div>
  );
}

export function Stagger(props: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: props.delayChildren ?? 0,
      },
    },
  };

  return (
    <motion.div
      className={props.className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {props.children}
    </motion.div>
  );
}


