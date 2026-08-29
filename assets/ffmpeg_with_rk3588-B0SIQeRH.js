import{L as e,b as t,x as n}from"./vue-DuDe-9L0.js";import{t as r}from"./app-DiVe-52v.js";var i=JSON.parse(`{"path":"/normal_hw/hff0uxj1/","title":"rk3588使用ffmpeg | 硬件文档","lang":"zh-CN","frontmatter":{"title":"rk3588使用ffmpeg","createTime":"2024/09/09 16:43:45","permalink":"/normal_hw/hff0uxj1/","description":"RK3588标称解码能力为 h264 8K@30fps h265 8K@60fps 提供了适配了 Rockchip MPP (Media Process Platform，rockchip中的硬件解码器的ffmpeg https://github.com/nyanmisaka/ffmpeg-rockchip 安装 ffmpeg-rockchip 中提供...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"rk3588使用ffmpeg\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-10-21T05:37:04.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://hyln.space/normal_hw/hff0uxj1/"}],["meta",{"property":"og:site_name","content":"Hyaline"}],["meta",{"property":"og:title","content":"rk3588使用ffmpeg"}],["meta",{"property":"og:description","content":"RK3588标称解码能力为 h264 8K@30fps h265 8K@60fps 提供了适配了 Rockchip MPP (Media Process Platform，rockchip中的硬件解码器的ffmpeg https://github.com/nyanmisaka/ffmpeg-rockchip 安装 ffmpeg-rockchip 中提供..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-10-21T05:37:04.000Z"}],["meta",{"property":"article:modified_time","content":"2024-10-21T05:37:04.000Z"}]]},"readingTime":{"minutes":1.91,"words":574},"git":{"createdTime":1725899925000,"updatedTime":1729489024000,"contributors":[{"name":"hyaline-wang","username":"hyaline-wang","email":"hyaline-wang","commits":3,"avatar":"https://avatars.githubusercontent.com/hyaline-wang?v=4","url":"https://github.com/hyaline-wang"}]},"autoDesc":true,"filePathRelative":"notes/normal_hw/机载电脑/ffmpeg_with_rk3588.md","headers":[]}`),a={name:`ffmpeg_with_rk3588.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<p>RK3588标称解码能力为</p><ul><li>h264 8K@30fps</li><li>h265 8K@60fps</li></ul><p>提供了适配了 Rockchip MPP (Media Process Platform，rockchip中的硬件解码器的ffmpeg https://github.com/nyanmisaka/ffmpeg-rockchip</p><h1 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h1><p>ffmpeg-rockchip 中提供了<a href="https://github.com/nyanmisaka/ffmpeg-rockchip/wiki/Compilation" target="_blank" rel="noopener noreferrer">安装方法</a>, 但是感觉写的不够清楚，他的意思是要先去找官方教程上的依赖安装部分，安装所需的依赖，(ffmpeg为编解码器提供了统一的接口，在安装教程中出现了多种编解码库的安装，是可选的，对于rk平台，我们肯定是为了使用硬件解码器，因此我们可以一个也不用安装)</p><p>以Vim2 edge2 ubuntu20.04为例，我成功的版本如下:</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 安装依赖</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> apt-get</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> update</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -qq</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> &amp;&amp;</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> apt-get</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -y</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  autoconf</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  automake</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  build-essential</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  cmake</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  git-core</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libass-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libfreetype6-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libgnutls28-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libmp3lame-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libsdl2-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libtool</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libva-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libvdpau-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libvorbis-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libxcb1-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libxcb-shm0-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  libxcb-xfixes0-dev</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  meson</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  ninja-build</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  pkg-config</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  texinfo</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  wget</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  yasm</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">  zlib1g-dev</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">sudo</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> apt</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> libunistring-dev</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> libaom-dev</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> libdav1d-dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 构建</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># Build MPP</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mkdir</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -p</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ~/dev</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> &amp;&amp;</span><span style="--shiki-light:#998418;--shiki-dark:#B8A965;"> cd</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ~/dev</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> clone</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -b</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> jellyfin-mpp</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --depth=1</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> https://github.com/nyanmisaka/mpp.git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkmpp</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">pushd rkmpp</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mkdir</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkmpp_build</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">pushd rkmpp_build</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">cmake</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    -DCMAKE_INSTALL_PREFIX=/usr</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    -DCMAKE_BUILD_TYPE=Release</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    -DBUILD_SHARED_LIBS=ON</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    -DBUILD_TEST=OFF</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">    ..</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">make</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -j</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> $(</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">nproc</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">make</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># Build RGA</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mkdir</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -p</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ~/dev</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> &amp;&amp;</span><span style="--shiki-light:#998418;--shiki-dark:#B8A965;"> cd</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ~/dev</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> clone</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -b</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> jellyfin-rga</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --depth=1</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> https://github.com/nyanmisaka/rk-mirrors.git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkrga</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">meson</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> setup</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkrga</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkrga_build</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    --prefix=/usr</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    --libdir=lib</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    --buildtype=release</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    --default-library=shared</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    -Dcpp_args=-fpermissive</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    -Dlibdrm=false</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> \\</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;">    -Dlibrga_demo=false</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">meson</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> configure</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkrga_build</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">ninja</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -C</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkrga_build</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># Build the minimal FFmpeg (You can customize the configure and install prefix)</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">mkdir</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -p</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ~/dev</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> &amp;&amp;</span><span style="--shiki-light:#998418;--shiki-dark:#B8A965;"> cd</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ~/dev</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> clone</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --depth=1</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> https://github.com/nyanmisaka/ffmpeg-rockchip.git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ffmpeg</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">cd</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ffmpeg</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">./configure</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --prefix=/usr</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --enable-gpl</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --enable-version3</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --enable-libdrm</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --enable-rkmpp</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --enable-rkrga</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 这里遇到了一个bug但是记不得了</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 可以排查一下是否前面的都安装了</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">make</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -j</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> $(</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">nproc</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># Try the compiled FFmpeg without installation</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 你现在的位置应该是 ~/dev/ffmpeg</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">./ffmpeg</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -decoders</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> |</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> grep</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkmpp</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">./ffmpeg</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -encoders</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> |</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> grep</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkmpp</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">./ffmpeg</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -filters</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;"> |</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> grep</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> rkrga</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># Install FFmpeg to the prefix path</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 需要sudo，主体不需要，是doc需要</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">make</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="rga" tabindex="-1"><a class="header-anchor" href="#rga"><span>rga</span></a></h1><p>RGA (Raster Graphic Acceleration Unit)是一个独立的2D硬件加速器，可用于加速点/线绘制，执行图像缩放、旋转、bitBlt、alpha混合等常见的2D图形操作。</p><h1 id="encode-video-c-example" tabindex="-1"><a class="header-anchor" href="#encode-video-c-example"><span>encode video | C++ example</span></a></h1><div class="language-cmakelists line-numbers-mode" data-highlighter="shiki" data-ext="cmakelists" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-cmakelists"><span class="line"><span>cmake_minimum_required(VERSION 3.0)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set(CMAKE_CXX_STANDARD 14)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>project(RealSenseExample)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>find_package(realsense2 REQUIRED)</span></span>
<span class="line"><span>find_package(OpenCV REQUIRED)</span></span>
<span class="line"><span>find_package(ZLIB REQUIRED)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  </span></span>
<span class="line"><span></span></span>
<span class="line"><span># Find FFmpeg package</span></span>
<span class="line"><span></span></span>
<span class="line"><span># add_executable(realsense_example main.cpp)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># target_link_libraries(realsense_example PRIVATE realsense2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># \${OpenCV_LIBS}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># /home/emnavi/dev/ffmpeg</span></span>
<span class="line"><span></span></span>
<span class="line"><span># )</span></span>
<span class="line"><span></span></span>
<span class="line"><span># target_include_directories(realsense_example PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span># \${OpenCV_INCLUDE_DIRS}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># /home/emnavi/dev/ffmpeg</span></span>
<span class="line"><span></span></span>
<span class="line"><span># )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>add_executable(encode_example encode_video.cpp)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>target_link_libraries(encode_example PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>realsense2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\${OpenCV_LIBS}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/home/emnavi/dev/ffmpeg/libavcodec/libavcodec.a</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/home/emnavi/dev/ffmpeg/libavutil/libavutil.a</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/home/emnavi/dev/ffmpeg/libavformat/libavformat.a</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pthread</span></span>
<span class="line"><span></span></span>
<span class="line"><span>X11</span></span>
<span class="line"><span></span></span>
<span class="line"><span>m</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vdpau</span></span>
<span class="line"><span></span></span>
<span class="line"><span>va</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rockchip_mpp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>drm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>va-drm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ZLIB::ZLIB</span></span>
<span class="line"><span></span></span>
<span class="line"><span>swresample</span></span>
<span class="line"><span></span></span>
<span class="line"><span>lzma</span></span>
<span class="line"><span></span></span>
<span class="line"><span>va-x11</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rga</span></span>
<span class="line"><span></span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>target_include_directories(encode_example PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\${OpenCV_INCLUDE_DIRS}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/home/emnavi/dev/ffmpeg</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-c++ line-numbers-mode" data-highlighter="shiki" data-ext="c++" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-c++"><span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>`,12)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};