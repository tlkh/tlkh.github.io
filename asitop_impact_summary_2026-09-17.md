# asitop: Downloads, Project Influence and Public Recognition

**Research snapshot:** 17 September 2026
**Project:** [tlkh/asitop](https://github.com/tlkh/asitop), Timothy Liu’s performance-monitoring command-line tool for Apple Silicon.

This summary draws on the previously compiled research and source tables. Statistics are recorded snapshots, not live counters; project relationships are classified according to the strength and scope of their attribution.

## At a glance

asitop has **over 340,000 recorded PyPI downloads**, approximately **4,600 GitHub stars**, and documented influence extending beyond its original Python implementation. The research identified **11 projects or components with explicit inspiration, derivation, design or implementation-reference credits**, plus **macmon**, which acknowledges asitop as a predecessor. Direct coverage includes **Apfeltalk** and **Jeff Geerling**, supported by international technical tutorials and practical community-use examples. Sources and qualifications follow below.

## 1. Download Statistics and Repository Interest

| Channel / source | Reporting period | Recorded figure |
| --- | --- | ---: |
| [PyPI — Pepy](https://pepy.tech/projects/asitop) | Lifetime downloads | **343,960** |
| PyPI — Pepy | Last 30 days | **2,760** |
| [PyPI — PyPI Stats](https://pypistats.org/packages/asitop) | Last month | **2,059** |
| PyPI — PyPI Stats | Last week | **366** |
| PyPI — PyPI Stats | Last day | **80** |
| [Homebrew](https://formulae.brew.sh/formula/asitop) | Last 30 days | **157–197 installs** |
| Homebrew | Last 90 days | **604–744 installs** |
| Homebrew | Last 365 days | **3,807–3,893 installs** |
| [GitHub](https://github.com/tlkh/asitop) | Repository snapshot | **Approximately 4,600 stars and 210 forks** |

**Interpretation.** “340,000+ PyPI downloads” is a defensible headline; “340,000 users” is not. Download events can include repeat installations and automated activity. PyPI Stats includes CI/CD traffic while excluding known mirror clients from its headline summaries. [Methodology](https://pypistats.org/faqs)

Pepy and PyPI Stats returned different recent totals; the exact reason was not verified. Homebrew returned two different cached snapshots, shown as ranges above—not statistical confidence intervals or separate populations. Homebrew users can opt out of analytics. [Homebrew methodology](https://docs.brew.sh/Analytics)

Do not add overlapping reporting periods, add Homebrew “Installs on Request” to “Installs,” or combine these counters into a unique-user estimate. GitHub stars and forks are interest/reuse indicators, not downloads. No verified all-channel lifetime total, clone count or unique-user count was obtained.

## 2. Inspired Projects and Technical Influence

### Explicitly attributed projects and components

| Project | Relationship to asitop | Documented evidence |
| --- | --- | --- |
| [**mactop**](https://github.com/metaspartan/mactop) | Explicit inspiration | Its acknowledgements credit asitop as the original inspiration for this Go-based Apple Silicon monitor. |
| [**NeoAsitop**](https://github.com/op06072/NeoAsitop) | Explicit inspiration | Describes itself as a Swift-based, asitop-inspired tool and credits `tlkh`. Independent implementation; not established as a code fork. |
| [**pumas**](https://github.com/graelo/pumas) | Explicit reimplementation | Describes itself as a reimplementation of asitop in Rust. |
| [**FluidTop**](https://github.com/FluidInference/fluidtop) | Explicit fork | Identifies itself as an enhanced asitop fork, with improvements aimed at newer Apple Silicon, terminal compatibility and local-AI workloads. |
| [**Mac Power Monitor**](https://www.bresink.com/osx/301025408/screenshots.html) | Explicit interface influence | The vendor says its Apple Silicon summary window is designed to resemble Timothy Liu’s asitop display. This establishes design influence, not source-code reuse. |
| [**asitop-csv-logger**](https://pypi.org/project/asitop-csv-logger/) | Explicit fork | Credits the original and adds CSV logging for historical metric analysis. |
| [**actop**](https://github.com/binlecode/actop) | Explicit inspiration | Names `tlkh/asitop` as inspiration while expressly distinguishing its independent architecture and codebase. |
| [**DGXTOP**](https://github.com/GigCoder-ai/dgxtop) | Explicit cross-platform inspiration | Credits asitop as inspiration for a monitor targeting Ubuntu and NVIDIA DGX Spark. |
| [**SiliconScope**, formerly WhisPlayInfo](https://github.com/kennss/SiliconScope) | Explicit motivation | The developer names asitop/NeoAsitop and btop limitations as motivation for a native SwiftUI dashboard. Not established as a direct code fork. |
| [**basitop**](https://github.com/tejasgajare/basitop) | Explicit implementation reference | Credits asitop as a reference implementation for `powermetrics` plist parsing. |
| [**silicon-monitor / simonlib Apple module**](https://docs.rs/silicon-monitor/latest/simonlib/silicon/apple/index.html) | Explicit component basis | The Apple module documentation states that it is based on asitop. Attribution applies to this component, not necessarily the entire cross-platform project. |

### Additional acknowledged predecessor relationship

[**macmon**](https://github.com/vladkens/macmon) identifies asitop as “The original tool” in its related-project section. This supports an acknowledged predecessor relationship, but the primary-source wording is weaker than an explicit fork or inspiration claim.

### What the influence demonstrates

The clearest evidence is **direct attribution by downstream developers**, rather than visual similarity or raw fork counts. The examples span independent implementations in Go, Swift and Rust; Python forks and extensions; interface design; and component-level implementation references.

Two particularly distinctive cases are **Mac Power Monitor**, which carries the interface concept into a [commercial graphical product](https://www.bresink.com/osx/301025408/download.php), and **DGXTOP**, which extends the inspiration beyond macOS into Linux/NVIDIA monitoring.

Project families are deduplicated: the former `context-labs/mactop` and current `metaspartan/mactop` count once; WhisPlayInfo/SiliconScope count once; and DGXTOP’s original repository and enhanced fork are grouped together.

## 3. Media and Technical Coverage

The underlying inventory contains **20 editorial, technical-blog, tutorial and news entries**: **11 direct asitop items** and **nine articles mentioning asitop while discussing descendants or related tools**. These are not 20 standalone press reviews.

### Direct coverage highlights

| Outlet / author | Date | Coverage |
| --- | --- | --- |
| [**Apfeltalk — Michael Reimann**](https://www.apfeltalk.de/magazin/news/ausprobiert-asitop-performance-analyse-tool-im-terminal/) | 2 Jul 2022 | Dedicated German hands-on review: *Ausprobiert: asitop – Performance-Analyse-Tool im Terminal*. |
| [**Jeff Geerling**](https://www.jeffgeerling.com/blog/2025/top-10-ways-monitor-linux-console/) | 15 Jan 2025 | Dedicated asitop section, screenshot and installation command in *Top 10 ways to monitor Linux in the console*. |
| [**Genmind — Gian Paolo Santopaolo**](https://genmind.ch/posts/enhance-your-ai-engineer-toolbelt-with-asitop-and-nvitop/) | 8 May 2022 | *Enhance Your AI Engineer Toolbelt with asitop and nvitop* positions it in a practical AI-engineering workflow. |
| [**davlgd labs**](https://labs.davlgd.com/posts/2024-01-apple-silicon-asitop/) | 17 Jan 2024 | Dedicated article on Apple Silicon monitoring and power consumption. |
| [**玩客 / Wker**](https://wker.com/macos-asitop/) | 17 Jul 2022 | Chinese-language overview of asitop’s performance and energy monitoring. |
| [**张洪Heo**](https://blog.zhheo.com/p/e6a897a1.html) | 14 Mar 2023 | Chinese installation and troubleshooting tutorial. |
| [**PyTorch Korea / PyTorchKR**](https://discuss.pytorch.kr/t/asitop-apple-silicon-cli-apple-silicon-top/3532) | 18 Feb 2024 | Dedicated Korean technical-community introduction. Not an official PyTorch endorsement. |
| [**Zenn — reij061**](https://zenn.dev/reij061/scraps/be1c56ad8dd3e7) | 10 Apr 2024 | Japanese developer notebook about Apple Silicon GPU monitoring. |

Additional Korean coverage includes [Macsplex](https://macsplex.com/MACTIP/6558690) (5 Jul 2024), [IamwhatIam](https://blog.iamwhatiam.co.kr/243) (22 Aug 2024) and [Wineskin](https://wineskin.tistory.com/24) (11 Sep 2024).

Jeff Geerling’s article links a companion video; no independently verified video-view count or asitop timestamp was recorded.

### Continuing recognition through related-tool reporting

Japanese publication **AAPL Ch.** repeatedly identifies asitop when explaining subsequent tools. Examples include the [mactop launch](https://applech2.com/archives/20240529-mactop-apple-silicon-monitor-cli.html) (29 May 2024), [macmon’s M4 support](https://applech2.com/archives/20241203-macmon-mac-monitor-support-apple-m4.html) (3 Dec 2024), [mactop’s menu-bar update](https://applech2.com/archives/20260223-mactop-for-apple-silicon-mac-monitor-support-menubar-gui.html) (23 Feb 2026), and [SiliconScope’s release](https://applech2.com/archives/20260620-siliconscope-apple-silicon-mac-system-monitor.html) (20 Jun 2026).

These demonstrate continued recognition of asitop’s role, but are not direct asitop reviews. Coverage also includes [technical caveats about power-derived Neural Engine utilisation estimates](https://applech2.com/archives/20251207-mactop-for-apple-silicon-back-in-neural-engine-usage.html), rather than uniformly positive endorsement.

## 4. Community Recognition and Practical Use

| Community | Recognition / use | Qualification |
| --- | --- | --- |
| [**Topaz Video AI community**](https://community.topazlabs.com/t/apple-silicon-m1-m2-pro-max-ultra-videoai-performance-neural-engine-or-gpu/39201/25) | A user describes using asitop to inspect CPU/GPU/ANE activity during video upscaling, with screenshots. | First-person workload evidence, not an official Topaz endorsement. |
| [**Hacker News**](https://news.ycombinator.com/item?id=39687132) | Recommended as a macOS alternative in a March 2024 nvtop discussion. | The parent thread’s points and comments belong to nvtop, not asitop. |
| [**Reddit r/LocalLLaMA**](https://www.reddit.com/r/LocalLLaMA/comments/1b4insj/whats_your_best_monitor_tool/) | Recommended for CPU, GPU, memory and power monitoring in a March 2024 discussion. | Relevant local-LLM community recognition, not a measured adoption total. |
| [**MacRumors forums**](https://forums.macrumors.com/threads/cant-launch-asitop.2348372/) | June 2022 installation and troubleshooting discussion. | A user forum thread, not MacRumors editorial coverage. |
| [**Blender Artists**](https://blenderartists.org/t/mac-m3-hardware-accelerated-rt-part-1/1264658/4994) | Referenced in an Apple Silicon performance/power-monitoring discussion. | Exact post date was not verified; the parent thread date must not be substituted. |
| [**Sam Hogan / X**](https://x.com/samhogan/status/1785122614421389413) | April 2024 commentary praises asitop while introducing a Go-based alternative, corroborating mactop’s origin story. | Search-index evidence only; the full post was not independently retrieved. Not independent press coverage. |

These examples support a conclusion of practical use and recognition across local AI, video processing, rendering and technical communities. They do not establish a unique-user total, aggregate audience reach or organisation-wide adoption.

## Overall Assessment

asitop’s documented impact rests on three distinct forms of evidence: **340,000+ PyPI downloads**, **explicit influence on downstream monitoring projects**, and **direct editorial coverage plus recurring technical-community recognition**. Its influence extends into independent language reimplementations, a commercial GUI and Linux/NVIDIA monitoring—not only forks of the original code.

The appropriate public framing is **documented distribution and developer influence**, without equating downloads with users or treating every tutorial, forum post and descendant article as a separate press feature.
