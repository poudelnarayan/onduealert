"use client";

import * as React from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function FadeIn(props: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : (props.y ?? 14) },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: easeOut, delay: props.delay ?? 0 },
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

export function Stagger(props: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: props.stagger ?? 0.06,
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
      viewport={{ once: true, amount: 0.25 }}
    >
      {props.children}
    </motion.div>
  );
}

export function Reveal(props: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={props.className}
      initial={{ opacity: 0, y: reduce ? 0 : 18, filter: reduce ? "none" : "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: easeOut, delay: props.delay ?? 0 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {props.children}
    </motion.div>
  );
}
