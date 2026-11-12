"use client";

import { ArrowLeft, ArrowRight, RotateCcw, TriangleAlert, Wrench } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { MotionScope } from "@/components/motion/motion-scope";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Domain } from "@/lib/content/schemas";
import { transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Step = Domain["flow"][number];

function StepDetail({ step }: { step: Step }) {
  return (
    <div className="space-y-3 text-sm leading-6">
      <p>{step.detail}</p>
      {step.risk && (
        <p className="flex gap-2 text-muted-foreground">
          <TriangleAlert className="mt-1 size-4 shrink-0 text-warning" aria-hidden />
          <span>
            <span className="font-medium text-foreground">Where it breaks: </span>
            {step.risk}
          </span>
        </p>
      )}
      {step.myWork && (
        <p className="flex gap-2 text-muted-foreground">
          <Wrench className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
          <span>
            <span className="font-medium text-foreground">My work here: </span>
            {step.myWork}
          </span>
        </p>
      )}
    </div>
  );
}

/**
 * How the domain works, step by step (docs/09-ux.md §4).
 * A row of steps on desktop with one shared detail panel; a vertical stepper on phones with the
 * detail under the selected step. Arrow keys move between steps.
 */
export function FlowDiagram({ steps }: { steps: Step[] }) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const current = steps[selected]!;

  // Walk-through: when the diagram first scrolls into view, a ring travels from step to step,
  // then returns to the start. Any click or key press stops it. Skipped with reduced motion.
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const timers = useRef<number[]>([]);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    const stepMs = 1100;
    timers.current = [
      window.setTimeout(() => setPlaying(true), 0),
      ...steps.map((_, index) => window.setTimeout(() => setSelected(index), index * stepMs)),
      window.setTimeout(() => {
        setSelected(0);
        setPlaying(false);
      }, steps.length * stepMs),
    ];
  }, [steps]);

  useEffect(() => {
    if (inView && !reduceMotion) play();
    return () => timers.current.forEach((timer) => window.clearTimeout(timer));
  }, [inView, reduceMotion, play]);

  function go(index: number, focus = false) {
    stop();
    const next = Math.max(0, Math.min(steps.length - 1, index));
    setSelected(next);
    if (focus) buttons.current[next]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const move = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (move === undefined) return;
    event.preventDefault();
    go(selected + move, true);
  }

  return (
    <MotionScope>
      <div ref={root}>
        <ol
          aria-label="Steps. Use the arrow keys to move between them."
          onKeyDown={onKeyDown}
          className="flex flex-col md:flex-row"
        >
          {steps.map((step, index) => {
            const active = index === selected;
            return (
              <li key={step.step} className="relative flex-1 pb-4 pl-10 md:pb-0 md:pl-0">
                {/* Connector: vertical on phones, horizontal on desktop. */}
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-9 bottom-0 left-[17px] w-px bg-border md:top-[17px] md:right-0 md:bottom-auto md:left-[calc(50%+22px)] md:h-px md:w-[calc(100%-44px)]"
                  />
                )}
                <button
                  ref={(element) => {
                    buttons.current[index] = element;
                  }}
                  type="button"
                  aria-current={active ? "step" : undefined}
                  tabIndex={active ? 0 : -1}
                  onClick={() => go(index)}
                  className="group flex w-full items-center gap-3 rounded-lg text-left md:flex-col md:gap-2 md:text-center"
                >
                  <span
                    className={cn(
                      "absolute left-0 grid size-9 place-items-center rounded-full border-2 font-mono text-sm transition-colors md:relative",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground group-hover:border-primary/50",
                    )}
                  >
                    {index + 1}
                    {active && (
                      <m.span
                        layoutId="flow-token"
                        transition={transitions.expressive}
                        className="absolute -inset-1.5 rounded-full border-2 border-primary/40"
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "py-1.5 font-semibold transition-colors md:py-0",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {step.step}
                  </span>
                </button>
                {active && (
                  <div className="mt-2 rounded-xl border bg-card p-4 md:hidden">
                    <StepDetail step={step} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div
          aria-live={playing ? "off" : "polite"}
          className="mt-6 hidden rounded-xl border bg-card p-6 md:block"
        >
          <h3 className="mb-3 text-lg font-semibold">
            <span className="font-mono text-sm text-primary">
              {selected + 1} / {steps.length}
            </span>{" "}
            {current.step}
          </h3>
          <StepDetail step={current} />
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-3.5"
            disabled={selected === 0}
            onClick={() => go(selected - 1)}
          >
            <ArrowLeft data-icon="inline-start" /> Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 px-3.5"
            disabled={selected === steps.length - 1}
            onClick={() => go(selected + 1)}
          >
            Next <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="ml-auto h-10 px-3.5"
            disabled={playing}
            onClick={play}
          >
            <RotateCcw data-icon="inline-start" /> {playing ? "Playing…" : "Replay"}
          </Button>
        </div>
      </div>
    </MotionScope>
  );
}
