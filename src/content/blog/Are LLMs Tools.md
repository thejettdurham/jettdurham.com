---
title: Are LLMs Tools?
description: I argue yes (from a certain point of view)
date: 2026-10-12
updated: 2026-10-12
tags:
  - ai
  - software-development
  - code
draft: false
---
This is in response to [Rich Hickey's](https://en.wikipedia.org/wiki/Rich_Hickey) statement on LinkedIn titled ['AI' is Not a Tool](https://www.linkedin.com/pulse/ai-tool-rich-hickey-kjl8e/). I massively respect his work, but I don't fully agree with his take here.

The whole post is not that long, so I'll quote it here since LinkedIn is such a dumpster-fire these days.

<details>
<summary>Read the full quote</summary>

> (I keep delivering this as a quip, here's a bit more)
> 
> First order of business - is '**tool**' going to have an interesting, distinguishing and thus illuminative meaning or be a mere platitudinous stand-in for "anything useful"?
> 
> We'll save tool as "anyone/thing that can be exploited" for the AI titans, for whom VCs, politicians, wannabe-titan-CEOs, software devs, rural towns etc are all 'tools'. The pockets on the front of my shirts are useful (I need to keep my reading glasses handy), but they are not tools. Similarly, fast food drive-thru windows are useful, but are not tools (more later).
> 
> Some definitions of '**tool**':
> 
> - a device or implement, especially one held in the hand, used to carry out a particular function
> - an instrument (such as a hammer or saw) used or worked by hand : an instrument used by a handicraftsperson or laborer in their work
> 
> What I like best - _A tool is something you_ **_wield_**.
> 
> - **wield** - to use (as a tool or instrument) especially with full command or power : handle, manipulate, control
> 
> Especially useful in that are:
> 
> - Held in your hand - a source of both control and feedback, and an indication of the intimacy of the act of use
> - Power - force, energy transmission and direction, leverage etc
> - Control - intention and continuous directing of the course of events
> 
> Tools are implements with which **_you_** do something, they do not do things for you. Tool use builds, rewards, and often requires, expertise and skill. The continuous application of technique and energy, and sensory feedback, are essential to the buildup of **expertise** (from experiri - "try").
> 
> Good tools have many properties LLMs lack - they are predictable, reliable, deterministic, of bounded function, hopefully simple etc.
> 
> What you learn while wielding a tool is something about the world, the task, the physics, logic etc of what you are trying to do or the situation you are trying to overcome. And often, something about yourself.
> 
> As a lifelong tool builder and user, I know what tools are. LLMs are not tools.
> 
> Control, sensory feedback, intention, intimacy, continuous direction, expertise etc are all missing from LLM use. LLMs are not wielded. **LLMs are** **_automation_**.
> 
> - **automation** - (of a device or process) working by itself with little or no direct human control.
> 
> A drive-thru is not a tool for cooking, it is automation for avoiding cooking. LLMs are not tools with which you write code - they are automation with which you avoid writing code, to which you abdicate writing code.
> 
> You don't direct the action of an LLM - you make requests and it acts on its own, without your energy or continuous direction. This request/automation cycle is not wielding, it's not control, it's not continuous, it's without feedback.
> 
> What you are doing while using automation, instead of learning real-world truths, is attempting to divine the details du jour of some automaton. And striving to game them - e.g. ordering a custom burger (no onions) in order to get a freshly made one. Or filling **voodoo.md** with just the right incantations. You are only a software update from everything you've 'learned' being rendered obsolete by the latest algorithm. (A soggy cold burger from which the onions have been removed) You have traded working with the world to working for a capricious robot.
> 
> It is a mistake to be haphazard about "tools" being equivalent to utility, e.g. saying - "the LLM didn't write my paper, I just used it as a tool to read and summarize some research papers". But you didn't _wield_ it to read those papers (as you might a Kindle). It read the papers, not you.
> 
> What do you miss by abdicating doing the reading? Pretty much everything. First and foremost, you miss learning how to write from those who can. You miss learning how to formulate an argument. You miss noticing things. You miss loading your background mind with fodder for novel ideas. You miss building trust in some authors and suspicion of others. You miss all the jokes. You miss all of the edges. You miss learning how to think.
> 
> Tools don't get "misaligned", they don't "go rogue", they don't "escape containment", "conspire" etc.
> 
> LLMs are not tools. I know many people use the phrase "just tools" simply to indicate "they are what you make of them". **_Except that's not true_**. Automation has intrinsic properties and differences from tools that you ignore at your peril.
> 
> Rich

</details>

I understand what this sentiment is trying to say, but I think the missing piece from the analysis is the identity of the wielder. In my view, Rich's point is better summed up like this:

> If you want to call yourself a *programmer* and you generate code, then LLMs are automations; not tools

This sentiment I would agree with. It has many analogs across tech and beyond.

- If you want to call yourself a songwriter, then Suno is an automation; not a tool
- If you want to call yourself a guitar maker, then a CNC Machine is an automation; not a tool
- If you want to call yourself a machine code developer, then a compiler is an...automation?

My theory is this: if you want to consider yourself a craftsman of X but you use automations to produce X, then you're simply not a craftsman of X. I believe this was Rich's main point.

But I can think of two ways you can harness the output of an automation to turn it into a tool.
## Change your identity

One of our biggest superpowers that we have as humans is the ability to change our identity. Its what makes us able to adapt to such a wide variety of conditions and climates. There have been [entire books](https://jamesclear.com/atomic-habits) written about the importance of identity and how to change it so I won't try to tell you everything here. But let's just say it can be as simple as telling yourself a different story. Consider these reframings:

| Before             | After                                                   |
| ------------------ | ------------------------------------------------------- |
| I'm a programmer   | I know what makes software work and scale well          |
| I'm a guitar maker | I know what makes a guitar play well and last for years |
| I'm a songwriter   | I know what makes a song that an audience loves[^1]     |
If you apply a different spin to how you use any particular thing, then you can make an argument for it being a tool. Or to say it another way: *an automation can become a tool if you shift your level thinking*. Understanding this is key to *surviving* in the Agentic Software Era, but you can combine it with the next strategy to *thrive* in it.
## Learn from the output

This is the more useful way to reframe LLMs as tools, so I'll spend more time here.

When I was young I had access to Adobe Photoshop and learned just enough to do some basic editing work. I wanted to improve but Youtube barely existed and I couldn't afford most of the books on the subject[^2]. But when it came time to do promotional artwork for my first real band, we didn't have any budget for an artist but we had a me. There was an artist who did the album artwork[^3] and he agreed to send me a CD with his work for that project. To my excitement, he included not just the final output but also all of the raw photoshop files!

For the first time, I could get a peek behind the curtain to see how a professional artist created print-worth graphics, and it was enlightening. Just by poking around the files I was able to learn techniques that I never would have learned otherwise: layer blending modes, layer masks, adjustment layers, and so on.

In this way, **an LLM may be the most powerful learning tool we've ever developed.** The outputs of LLMs and Agentic coding harnesses represents an enormous opportunity to learn an entirely new craft or to go deeper on your current craft. Caveat: this only works for outputs that are an intermediate representation of the final product. Anything that turns a prompt into the final output (like a full image with ChatGPT or a full song with Suno) with generating or exposing the intermediate representation (a Photoshop file or a Digital Audio Workstation session) does not afford this opportunity.

LLMs let you take learning even further because they will happily answer questions about what they generated without judgement. And modern frontier models are pushing this boundary beyond code. For example they are increasingly becoming more capable of actually driving creative tools like Blender. Instead of just getting the final 3D mesh, you also get a full blender file that you can edit yourself. And if you don't know how the tool *can* teach you. It's all a matter of intent.
## What of it?

We've come a long way from the question that started this whole tirade: *are LLMs tools or not*? For me, **LLMs are undeniably tools** because I have real-world evidence showing that they help me solve my employer's problems faster and more thoroughly than I could without them. Outside of work I use them to amplify my leverage and build things that I would not have built otherwise[^4]. 

Rich probably has little use for LLMs in his work because he is building the fundamental primitives they need to work. Someone had to invent Clojure before the LLMs can write an app with it just as someone had to invent English before Tolkein could write The Lord of the Rings. But the average software engineer working in the industry isn't in that same position. Most of us need to think at a higher level: business requirements, system design, user experience, and so on.[^5] The actual computer code in that domain has always been secondary to those goals and this is where LLMs as tools has the clearest defense. 

[^1]: As a musician I'm not particularly convinced by any argument in defense of Suno, but just bear with me. I'll take a proper shit on it later

[^2]: Hell, I couldn't even afford the software at the time 🏴‍☠️. I didn't understand at the time that I was taking the intended path into the Adobe pipeline.

[^3]: Long story as to why there was an album before a band. I'll tell it some other day.

[^4]: Note my careful wording. It's not that I couldn't have built most of these things, but the level of effort involved for something as trivial as an autohotkey script to take perfect screenshots from No Man's Sky for panorama stitching was high enough that I was never going to dump a whole weekend into it.

[^5]: This is exactly why we are called Engineers instead of Programmers these days.
