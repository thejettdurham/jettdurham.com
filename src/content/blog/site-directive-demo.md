---
title: Site directive demo
description: A local draft preview of image metadata and YouTube embeds.
date: 2026-10-06
draft: true
---

This draft demonstrates every field supported by the `site` preprocessing directive. Open it at `/blog/site-directive-demo/` with `pnpm dev`. It is excluded from production builds, the writing index, RSS, and the sitemap.

Each example uses real Markdown processed by the same adapter as published posts. Inspect this file to see the source. A `site` fence must immediately follow a standalone image or YouTube URL, with a blank line separating the blocks. Fields use one `key=value` line each; values are plain text and may contain `=`.

## Images

### Ordinary image, without a directive

Markdown alt text works normally. This uses an existing local image, so viewing the image needs no external service.

![A portrait of Jett](/images/jett.jpg)

### Alt text only

The directive replaces the image's original alt text. No caption or figure wrapper is added.

![This text is replaced](/images/jett.jpg)

```site
alt=A portrait of Jett, using alt text from the site directive
```

### Alt text and caption

The image and caption render together as a figure. Quotes, ampersands, angle brackets, and equals signs remain text.

![](/images/jett.jpg)

```site
alt=A portrait of Jett
caption=A local image: "Jett" & friends <demo> — caption=plain text.
```

### Decorative image with empty alt text

An explicit empty `alt` is supported for decorative images. The caption is optional.

![](/images/jett.jpg)

```site
alt=
```

## YouTube

These examples reference the same video using each supported URL format. The placeholder should fill the article width. Selecting Play video replaces it with a responsive YouTube player. The player contacts YouTube only after that click; playback requires internet access. With JavaScript disabled, or when opening the link in a new tab, the placeholder opens YouTube.

### Watch URL without a directive

The default accessible title is “YouTube video.”

https://www.youtube.com/watch?v=jNQXAC9IVRw

### Short URL with title only

https://youtu.be/jNQXAC9IVRw

```site
title=Me at the zoo — custom player title
```

### Shorts URL with caption only

The title still defaults to “YouTube video.” The URL format is normalized to the same embed player.

https://www.youtube.com/shorts/jNQXAC9IVRw

```site
caption=Caption without a custom title.
```

### Embed URL with title and caption

https://www.youtube.com/embed/jNQXAC9IVRw

```site
title=Me at the zoo: "first video" & <demo>
caption=A caption with quotes, an ampersand & an equals sign: video=YouTube.
```

### Mobile watch URL with empty optional fields

Empty titles fall back to “YouTube video”; empty captions omit the figure wrapper.

https://m.youtube.com/watch?v=jNQXAC9IVRw

```site
title=
caption=
```

## Normal Markdown still works

An inline [YouTube link](https://www.youtube.com/watch?v=jNQXAC9IVRw) stays a link because it shares its paragraph with other text.

Other fenced code blocks remain visible:

```text
alt=This is ordinary code, not a site directive.
caption=Only fences labeled site are consumed.
```

## Validation rules

For images, `alt` is required whenever a directive is present; `caption` is optional. For videos, both `title` and `caption` are optional. Blank lines inside a directive are ignored, and whitespace around keys and values is trimmed.

A misplaced `site` block, unknown field, duplicate field, or line without `=` fails preprocessing with a source line number. These invalid cases are described here instead of included as live directives so this preview can render.
