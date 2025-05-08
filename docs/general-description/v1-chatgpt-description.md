# HarrysFirebolt: Project Description

**HarrysFirebolt** is a prompt quality enforcement layer designed specifically for integration with Cursor AI, the AI-enabled IDE. Rather than reacting to flawed or incomplete code, HarrysFirebolt intervenes earlier in the development process by preprocessing prompts before they are ever submitted to the IDE.

## Core Purpose

The core mission of HarrysFirebolt is to enhance the quality, clarity, and maintainability of AI-assisted software development by establishing a rigorous interface between the user and the AI toolchain. It ensures that:

- Prompts are **explicitly clear** and free of ambiguity.
- Each prompt is accompanied by **structured planning documents** that outline objectives, epics, tasks, and estimated timelines.
- **All file changes are logged**, with detailed dev logs, pseudocode summaries, and evolving project structure maps.
- **Commits are suggested regularly**, with intelligent reminders based on activity or elapsed time.
- **Preferred tools are prioritized**, and tool decisions are tracked and justified in a `tools.md` file.
- The AI **detects and prevents conversational loops**, with automatic fallback and reset systems.

## Design Philosophy

HarrysFirebolt is not a passive assistant but an assertive partner in development. It upholds a series of strict foundational laws to preserve discipline and quality in every phase of prompting and planning.

## Integration Style

Though tightly coupled with Cursor AI, the system is designed to be **minimally dependent on external integrations**. Most context is gathered from the user and the ongoing conversation, minimizing reliance on cloud services or third-party APIs. It functions as a self-contained planning and validation module embedded into a broader web application interface.

## Ultimate Goal

The ultimate aim is to empower developers to write better prompts, make cleaner decisions, and ship higher-quality code with less iteration and rework. HarrysFirebolt is built on the principle that **high-quality inputs lead to high-quality outputs**—especially when working with AI.
