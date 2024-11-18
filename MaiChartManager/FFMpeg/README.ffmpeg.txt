FFmpeg 64-bit shared Windows build from www.gyan.dev

Version: 7.0.2-full_build-www.gyan.dev

License: GPL v3

Source Code: https://github.com/FFmpeg/FFmpeg/commit/e3a61e9103

External Assets
frei0r plugins:   https://www.gyan.dev/ffmpeg/builds/ffmpeg-frei0r-plugins
lensfun database: https://www.gyan.dev/ffmpeg/builds/ffmpeg-lensfun-db

release-full build configuration: 

ARCH                      x86 (generic)
big-endian                no
runtime cpu detection     yes
standalone assembly       yes
x86 assembler             nasm
MMX enabled               yes
MMXEXT enabled            yes
3DNow! enabled            yes
3DNow! extended enabled   yes
SSE enabled               yes
SSSE3 enabled             yes
AESNI enabled             yes
AVX enabled               yes
AVX2 enabled              yes
AVX-512 enabled           yes
AVX-512ICL enabled        yes
XOP enabled               yes
FMA3 enabled              yes
FMA4 enabled              yes
i686 features enabled     yes
CMOV is fast              yes
EBX available             yes
EBP available             yes
debug symbols             yes
strip symbols             yes
optimize for size         no
optimizations             yes
static                    no
shared                    yes
postprocessing support    yes
network support           yes
threading support         pthreads
safe bitstream reader     yes
texi2html enabled         no
perl enabled              yes
pod2man enabled           yes
makeinfo enabled          yes
makeinfo supports HTML    yes
xmllint enabled           yes

External libraries:
avisynth                libgsm                  libsvtav1
bzlib                   libharfbuzz             libtheora
chromaprint             libilbc                 libtwolame
frei0r                  libjxl                  libuavs3d
gmp                     liblensfun              libvidstab
gnutls                  libmodplug              libvmaf
iconv                   libmp3lame              libvo_amrwbenc
ladspa                  libmysofa               libvorbis
libaom                  libopencore_amrnb       libvpx
libaribb24              libopencore_amrwb       libwebp
libaribcaption          libopenjpeg             libx264
libass                  libopenmpt              libx265
libbluray               libopus                 libxavs2
libbs2b                 libplacebo              libxevd
libcaca                 librav1e                libxeve
libcdio                 librist                 libxml2
libcodec2               librubberband           libxvid
libdav1d                libshaderc              libzimg
libdavs2                libshine                libzmq
libflite                libsnappy               libzvbi
libfontconfig           libsoxr                 lzma
libfreetype             libspeex                mediafoundation
libfribidi              libsrt                  sdl2
libgme                  libssh                  zlib

External libraries providing hardware acceleration:
amf                     d3d12va                 nvdec
cuda                    dxva2                   nvenc
cuda_llvm               ffnvcodec               opencl
cuvid                   libmfx                  vaapi
d3d11va                 libvpl                  vulkan

Libraries:
avcodec                 avformat                swresample
avdevice                avutil                  swscale
avfilter                postproc

Programs:
ffmpeg                  ffplay                  ffprobe

Enabled decoders:
aac                     g2m                     pcm_vidc
aac_fixed               g723_1                  pcx
aac_latm                g729                    pdv
aasc                    gdv                     pfm
ac3                     gem                     pgm
ac3_fixed               gif                     pgmyuv
acelp_kelvin            gremlin_dpcm            pgssub
adpcm_4xm               gsm                     pgx
adpcm_adx               gsm_ms                  phm
adpcm_afc               h261                    photocd
adpcm_agm               h263                    pictor
adpcm_aica              h263i                   pixlet
adpcm_argo              h263p                   pjs
adpcm_ct                h264                    png
adpcm_dtk               h264_cuvid              ppm
adpcm_ea                h264_qsv                prores
adpcm_ea_maxis_xa       hap                     prosumer
adpcm_ea_r1             hca                     psd
adpcm_ea_r2             hcom                    ptx
adpcm_ea_r3             hdr                     qcelp
adpcm_ea_xas            hevc                    qdm2
adpcm_g722              hevc_cuvid              qdmc
adpcm_g726              hevc_qsv                qdraw
adpcm_g726le            hnm4_video              qoa
adpcm_ima_acorn         hq_hqa                  qoi
adpcm_ima_alp           hqx                     qpeg
adpcm_ima_amv           huffyuv                 qtrle
adpcm_ima_apc           hymt                    r10k
adpcm_ima_apm           iac                     r210
adpcm_ima_cunning       idcin                   ra_144
adpcm_ima_dat4          idf                     ra_288
adpcm_ima_dk3           iff_ilbm                ralf
adpcm_ima_dk4           ilbc                    rasc
adpcm_ima_ea_eacs       imc                     rawvideo
adpcm_ima_ea_sead       imm4                    realtext
adpcm_ima_iss           imm5                    rka
adpcm_ima_moflex        indeo2                  rl2
adpcm_ima_mtf           indeo3                  roq
adpcm_ima_oki           indeo4                  roq_dpcm
adpcm_ima_qt            indeo5                  rpza
adpcm_ima_rad           interplay_acm           rscc
adpcm_ima_smjpeg        interplay_dpcm          rtv1
adpcm_ima_ssi           interplay_video         rv10
adpcm_ima_wav           ipu                     rv20
adpcm_ima_ws            jacosub                 rv30
adpcm_ms                jpeg2000                rv40
adpcm_mtaf              jpegls                  s302m
adpcm_psx               jv                      sami
adpcm_sbpro_2           kgv1                    sanm
adpcm_sbpro_3           kmvc                    sbc
adpcm_sbpro_4           lagarith                scpr
adpcm_swf               lead                    screenpresso
adpcm_thp               libaom_av1              sdx2_dpcm
adpcm_thp_le            libaribb24              sga
adpcm_vima              libaribcaption          sgi
adpcm_xa                libcodec2               sgirle
adpcm_xmd               libdav1d                sheervideo
adpcm_yamaha            libdavs2                shorten
adpcm_zork              libgsm                  simbiosis_imx
agm                     libgsm_ms               sipr
aic                     libilbc                 siren
alac                    libjxl                  smackaud
alias_pix               libopencore_amrnb       smacker
als                     libopencore_amrwb       smc
amrnb                   libopus                 smvjpeg
amrwb                   libspeex                snow
amv                     libuavs3d               sol_dpcm
anm                     libvorbis               sonic
ansi                    libvpx_vp8              sp5x
anull                   libvpx_vp9              speedhq
apac                    libxevd                 speex
ape                     libzvbi_teletext        srgc
apng                    loco                    srt
aptx                    lscr                    ssa
aptx_hd                 m101                    stl
arbc                    mace3                   subrip
argo                    mace6                   subviewer
ass                     magicyuv                subviewer1
asv1                    mdec                    sunrast
asv2                    media100                svq1
atrac1                  metasound               svq3
atrac3                  microdvd                tak
atrac3al                mimic                   targa
atrac3p                 misc4                   targa_y216
atrac3pal               mjpeg                   tdsc
atrac9                  mjpeg_cuvid             text
aura                    mjpeg_qsv               theora
aura2                   mjpegb                  thp
av1                     mlp                     tiertexseqvideo
av1_cuvid               mmvideo                 tiff
av1_qsv                 mobiclip                tmv
avrn                    motionpixels            truehd
avrp                    movtext                 truemotion1
avs                     mp1                     truemotion2
avui                    mp1float                truemotion2rt
bethsoftvid             mp2                     truespeech
bfi                     mp2float                tscc
bink                    mp3                     tscc2
binkaudio_dct           mp3adu                  tta
binkaudio_rdft          mp3adufloat             twinvq
bintext                 mp3float                txd
bitpacked               mp3on4                  ulti
bmp                     mp3on4float             utvideo
bmv_audio               mpc7                    v210
bmv_video               mpc8                    v210x
bonk                    mpeg1_cuvid             v308
brender_pix             mpeg1video              v408
c93                     mpeg2_cuvid             v410
cavs                    mpeg2_qsv               vb
cbd2_dpcm               mpeg2video              vble
ccaption                mpeg4                   vbn
cdgraphics              mpeg4_cuvid             vc1
cdtoons                 mpegvideo               vc1_cuvid
cdxl                    mpl2                    vc1_qsv
cfhd                    msa1                    vc1image
cinepak                 mscc                    vcr1
clearvideo              msmpeg4v1               vmdaudio
cljr                    msmpeg4v2               vmdvideo
cllc                    msmpeg4v3               vmix
comfortnoise            msnsiren                vmnc
cook                    msp2                    vnull
cpia                    msrle                   vorbis
cri                     mss1                    vp3
cscd                    mss2                    vp4
cyuv                    msvideo1                vp5
dca                     mszh                    vp6
dds                     mts2                    vp6a
derf_dpcm               mv30                    vp6f
dfa                     mvc1                    vp7
dfpwm                   mvc2                    vp8
dirac                   mvdv                    vp8_cuvid
dnxhd                   mvha                    vp8_qsv
dolby_e                 mwsc                    vp9
dpx                     mxpeg                   vp9_cuvid
dsd_lsbf                nellymoser              vp9_qsv
dsd_lsbf_planar         notchlc                 vplayer
dsd_msbf                nuv                     vqa
dsd_msbf_planar         on2avc                  vqc
dsicinaudio             opus                    vvc
dsicinvideo             osq                     wady_dpcm
dss_sp                  paf_audio               wavarc
dst                     paf_video               wavpack
dvaudio                 pam                     wbmp
dvbsub                  pbm                     wcmv
dvdsub                  pcm_alaw                webp
dvvideo                 pcm_bluray              webvtt
dxa                     pcm_dvd                 wmalossless
dxtory                  pcm_f16le               wmapro
dxv                     pcm_f24le               wmav1
eac3                    pcm_f32be               wmav2
eacmv                   pcm_f32le               wmavoice
eamad                   pcm_f64be               wmv1
eatgq                   pcm_f64le               wmv2
eatgv                   pcm_lxf                 wmv3
eatqi                   pcm_mulaw               wmv3image
eightbps                pcm_s16be               wnv1
eightsvx_exp            pcm_s16be_planar        wrapped_avframe
eightsvx_fib            pcm_s16le               ws_snd1
escape124               pcm_s16le_planar        xan_dpcm
escape130               pcm_s24be               xan_wc3
evrc                    pcm_s24daud             xan_wc4
exr                     pcm_s24le               xbin
fastaudio               pcm_s24le_planar        xbm
ffv1                    pcm_s32be               xface
ffvhuff                 pcm_s32le               xl
ffwavesynth             pcm_s32le_planar        xma1
fic                     pcm_s64be               xma2
fits                    pcm_s64le               xpm
flac                    pcm_s8                  xsub
flashsv                 pcm_s8_planar           xwd
flashsv2                pcm_sga                 y41p
flic                    pcm_u16be               ylc
flv                     pcm_u16le               yop
fmvc                    pcm_u24be               yuv4
fourxm                  pcm_u24le               zero12v
fraps                   pcm_u32be               zerocodec
frwu                    pcm_u32le               zlib
ftr                     pcm_u8                  zmbv

Enabled encoders:
a64multi                hevc_vaapi              pcm_s8_planar
a64multi5               huffyuv                 pcm_u16be
aac                     jpeg2000                pcm_u16le
aac_mf                  jpegls                  pcm_u24be
ac3                     libaom_av1              pcm_u24le
ac3_fixed               libcodec2               pcm_u32be
ac3_mf                  libgsm                  pcm_u32le
adpcm_adx               libgsm_ms               pcm_u8
adpcm_argo              libilbc                 pcm_vidc
adpcm_g722              libjxl                  pcx
adpcm_g726              libmp3lame              pfm
adpcm_g726le            libopencore_amrnb       pgm
adpcm_ima_alp           libopenjpeg             pgmyuv
adpcm_ima_amv           libopus                 phm
adpcm_ima_apm           librav1e                png
adpcm_ima_qt            libshine                ppm
adpcm_ima_ssi           libspeex                prores
adpcm_ima_wav           libsvtav1               prores_aw
adpcm_ima_ws            libtheora               prores_ks
adpcm_ms                libtwolame              qoi
adpcm_swf               libvo_amrwbenc          qtrle
adpcm_yamaha            libvorbis               r10k
alac                    libvpx_vp8              r210
alias_pix               libvpx_vp9              ra_144
amv                     libwebp                 rawvideo
anull                   libwebp_anim            roq
apng                    libx264                 roq_dpcm
aptx                    libx264rgb              rpza
aptx_hd                 libx265                 rv10
ass                     libxavs2                rv20
asv1                    libxeve                 s302m
asv2                    libxvid                 sbc
av1_amf                 ljpeg                   sgi
av1_nvenc               magicyuv                smc
av1_qsv                 mjpeg                   snow
av1_vaapi               mjpeg_qsv               sonic
avrp                    mjpeg_vaapi             sonic_ls
avui                    mlp                     speedhq
bitpacked               movtext                 srt
bmp                     mp2                     ssa
cfhd                    mp2fixed                subrip
cinepak                 mp3_mf                  sunrast
cljr                    mpeg1video              svq1
comfortnoise            mpeg2_qsv               targa
dca                     mpeg2_vaapi             text
dfpwm                   mpeg2video              tiff
dnxhd                   mpeg4                   truehd
dpx                     msmpeg4v2               tta
dvbsub                  msmpeg4v3               ttml
dvdsub                  msrle                   utvideo
dvvideo                 msvideo1                v210
dxv                     nellymoser              v308
eac3                    opus                    v408
exr                     pam                     v410
ffv1                    pbm                     vbn
ffvhuff                 pcm_alaw                vc2
fits                    pcm_bluray              vnull
flac                    pcm_dvd                 vorbis
flashsv                 pcm_f32be               vp8_vaapi
flashsv2                pcm_f32le               vp9_qsv
flv                     pcm_f64be               vp9_vaapi
g723_1                  pcm_f64le               wavpack
gif                     pcm_mulaw               wbmp
h261                    pcm_s16be               webvtt
h263                    pcm_s16be_planar        wmav1
h263p                   pcm_s16le               wmav2
h264_amf                pcm_s16le_planar        wmv1
h264_mf                 pcm_s24be               wmv2
h264_nvenc              pcm_s24daud             wrapped_avframe
h264_qsv                pcm_s24le               xbm
h264_vaapi              pcm_s24le_planar        xface
hap                     pcm_s32be               xsub
hdr                     pcm_s32le               xwd
hevc_amf                pcm_s32le_planar        y41p
hevc_mf                 pcm_s64be               yuv4
hevc_nvenc              pcm_s64le               zlib
hevc_qsv                pcm_s8                  zmbv

Enabled hwaccels:
av1_d3d11va             hevc_dxva2              vc1_dxva2
av1_d3d11va2            hevc_nvdec              vc1_nvdec
av1_d3d12va             hevc_vaapi              vc1_vaapi
av1_dxva2               hevc_vulkan             vp8_nvdec
av1_nvdec               mjpeg_nvdec             vp8_vaapi
av1_vaapi               mjpeg_vaapi             vp9_d3d11va
av1_vulkan              mpeg1_nvdec             vp9_d3d11va2
h263_vaapi              mpeg2_d3d11va           vp9_d3d12va
h264_d3d11va            mpeg2_d3d11va2          vp9_dxva2
h264_d3d11va2           mpeg2_d3d12va           vp9_nvdec
h264_d3d12va            mpeg2_dxva2             vp9_vaapi
h264_dxva2              mpeg2_nvdec             wmv3_d3d11va
h264_nvdec              mpeg2_vaapi             wmv3_d3d11va2
h264_vaapi              mpeg4_nvdec             wmv3_d3d12va
h264_vulkan             mpeg4_vaapi             wmv3_dxva2
hevc_d3d11va            vc1_d3d11va             wmv3_nvdec
hevc_d3d11va2           vc1_d3d11va2            wmv3_vaapi
hevc_d3d12va            vc1_d3d12va

Enabled parsers:
aac                     dvdsub                  mpegaudio
aac_latm                evc                     mpegvideo
ac3                     flac                    opus
adx                     ftr                     png
amr                     g723_1                  pnm
av1                     g729                    qoi
avs2                    gif                     rv34
avs3                    gsm                     sbc
bmp                     h261                    sipr
cavsvideo               h263                    tak
cook                    h264                    vc1
cri                     hdr                     vorbis
dca                     hevc                    vp3
dirac                   ipu                     vp8
dnxhd                   jpeg2000                vp9
dolby_e                 jpegxl                  vvc
dpx                     misc4                   webp
dvaudio                 mjpeg                   xbm
dvbsub                  mlp                     xma
dvd_nav                 mpeg4video              xwd

Enabled demuxers:
aa                      idf                     pcm_mulaw
aac                     iff                     pcm_s16be
aax                     ifv                     pcm_s16le
ac3                     ilbc                    pcm_s24be
ac4                     image2                  pcm_s24le
ace                     image2_alias_pix        pcm_s32be
acm                     image2_brender_pix      pcm_s32le
act                     image2pipe              pcm_s8
adf                     image_bmp_pipe          pcm_u16be
adp                     image_cri_pipe          pcm_u16le
ads                     image_dds_pipe          pcm_u24be
adx                     image_dpx_pipe          pcm_u24le
aea                     image_exr_pipe          pcm_u32be
afc                     image_gem_pipe          pcm_u32le
aiff                    image_gif_pipe          pcm_u8
aix                     image_hdr_pipe          pcm_vidc
alp                     image_j2k_pipe          pdv
amr                     image_jpeg_pipe         pjs
amrnb                   image_jpegls_pipe       pmp
amrwb                   image_jpegxl_pipe       pp_bnk
anm                     image_pam_pipe          pva
apac                    image_pbm_pipe          pvf
apc                     image_pcx_pipe          qcp
ape                     image_pfm_pipe          qoa
apm                     image_pgm_pipe          r3d
apng                    image_pgmyuv_pipe       rawvideo
aptx                    image_pgx_pipe          realtext
aptx_hd                 image_phm_pipe          redspark
aqtitle                 image_photocd_pipe      rka
argo_asf                image_pictor_pipe       rl2
argo_brp                image_png_pipe          rm
argo_cvg                image_ppm_pipe          roq
asf                     image_psd_pipe          rpl
asf_o                   image_qdraw_pipe        rsd
ass                     image_qoi_pipe          rso
ast                     image_sgi_pipe          rtp
au                      image_sunrast_pipe      rtsp
av1                     image_svg_pipe          s337m
avi                     image_tiff_pipe         sami
avisynth                image_vbn_pipe          sap
avr                     image_webp_pipe         sbc
avs                     image_xbm_pipe          sbg
avs2                    image_xpm_pipe          scc
avs3                    image_xwd_pipe          scd
bethsoftvid             imf                     sdns
bfi                     ingenient               sdp
bfstm                   ipmovie                 sdr2
bink                    ipu                     sds
binka                   ircam                   sdx
bintext                 iss                     segafilm
bit                     iv8                     ser
bitpacked               ivf                     sga
bmv                     ivr                     shorten
boa                     jacosub                 siff
bonk                    jpegxl_anim             simbiosis_imx
brstm                   jv                      sln
c93                     kux                     smacker
caf                     kvag                    smjpeg
cavsvideo               laf                     smush
cdg                     libgme                  sol
cdxl                    libmodplug              sox
cine                    libopenmpt              spdif
codec2                  live_flv                srt
codec2raw               lmlm4                   stl
concat                  loas                    str
dash                    lrc                     subviewer
data                    luodat                  subviewer1
daud                    lvf                     sup
dcstr                   lxf                     svag
derf                    m4v                     svs
dfa                     matroska                swf
dfpwm                   mca                     tak
dhav                    mcc                     tedcaptions
dirac                   mgsts                   thp
dnxhd                   microdvd                threedostr
dsf                     mjpeg                   tiertexseq
dsicin                  mjpeg_2000              tmv
dss                     mlp                     truehd
dts                     mlv                     tta
dtshd                   mm                      tty
dv                      mmf                     txd
dvbsub                  mods                    ty
dvbtxt                  moflex                  usm
dxa                     mov                     v210
ea                      mp3                     v210x
ea_cdata                mpc                     vag
eac3                    mpc8                    vc1
epaf                    mpegps                  vc1t
evc                     mpegts                  vividas
ffmetadata              mpegtsraw               vivo
filmstrip               mpegvideo               vmd
fits                    mpjpeg                  vobsub
flac                    mpl2                    voc
flic                    mpsub                   vpk
flv                     msf                     vplayer
fourxm                  msnwc_tcp               vqf
frm                     msp                     vvc
fsb                     mtaf                    w64
fwse                    mtv                     wady
g722                    musx                    wav
g723_1                  mv                      wavarc
g726                    mvi                     wc3
g726le                  mxf                     webm_dash_manifest
g729                    mxg                     webvtt
gdv                     nc                      wsaud
genh                    nistsphere              wsd
gif                     nsp                     wsvqa
gsm                     nsv                     wtv
gxf                     nut                     wv
h261                    nuv                     wve
h263                    obu                     xa
h264                    ogg                     xbin
hca                     oma                     xmd
hcom                    osq                     xmv
hevc                    paf                     xvag
hls                     pcm_alaw                xwma
hnm                     pcm_f32be               yop
iamf                    pcm_f32le               yuv4mpegpipe
ico                     pcm_f64be
idcin                   pcm_f64le

Enabled muxers:
a64                     h261                    pcm_s16le
ac3                     h263                    pcm_s24be
ac4                     h264                    pcm_s24le
adts                    hash                    pcm_s32be
adx                     hds                     pcm_s32le
aea                     hevc                    pcm_s8
aiff                    hls                     pcm_u16be
alp                     iamf                    pcm_u16le
amr                     ico                     pcm_u24be
amv                     ilbc                    pcm_u24le
apm                     image2                  pcm_u32be
apng                    image2pipe              pcm_u32le
aptx                    ipod                    pcm_u8
aptx_hd                 ircam                   pcm_vidc
argo_asf                ismv                    psp
argo_cvg                ivf                     rawvideo
asf                     jacosub                 rcwt
asf_stream              kvag                    rm
ass                     latm                    roq
ast                     lrc                     rso
au                      m4v                     rtp
avi                     matroska                rtp_mpegts
avif                    matroska_audio          rtsp
avm2                    md5                     sap
avs2                    microdvd                sbc
avs3                    mjpeg                   scc
bit                     mkvtimestamp_v2         segafilm
caf                     mlp                     segment
cavsvideo               mmf                     smjpeg
chromaprint             mov                     smoothstreaming
codec2                  mp2                     sox
codec2raw               mp3                     spdif
crc                     mp4                     spx
dash                    mpeg1system             srt
data                    mpeg1vcd                stream_segment
daud                    mpeg1video              streamhash
dfpwm                   mpeg2dvd                sup
dirac                   mpeg2svcd               swf
dnxhd                   mpeg2video              tee
dts                     mpeg2vob                tg2
dv                      mpegts                  tgp
eac3                    mpjpeg                  truehd
evc                     mxf                     tta
f4v                     mxf_d10                 ttml
ffmetadata              mxf_opatom              uncodedframecrc
fifo                    null                    vc1
filmstrip               nut                     vc1t
fits                    obu                     voc
flac                    oga                     vvc
flv                     ogg                     w64
framecrc                ogv                     wav
framehash               oma                     webm
framemd5                opus                    webm_chunk
g722                    pcm_alaw                webm_dash_manifest
g723_1                  pcm_f32be               webp
g726                    pcm_f32le               webvtt
g726le                  pcm_f64be               wsaud
gif                     pcm_f64le               wtv
gsm                     pcm_mulaw               wv
gxf                     pcm_s16be               yuv4mpegpipe

Enabled protocols:
async                   http                    rtmp
bluray                  httpproxy               rtmpe
cache                   https                   rtmps
concat                  icecast                 rtmpt
concatf                 ipfs_gateway            rtmpte
crypto                  ipns_gateway            rtmpts
data                    librist                 rtp
fd                      libsrt                  srtp
ffrtmpcrypt             libssh                  subfile
ffrtmphttp              libzmq                  tcp
file                    md5                     tee
ftp                     mmsh                    tls
gopher                  mmst                    udp
gophers                 pipe                    udplite
hls                     prompeg

Enabled filters:
a3dscope                ddagrab                 palettegen
aap                     deband                  paletteuse
abench                  deblock                 pan
abitscope               decimate                perms
acompressor             deconvolve              perspective
acontrast               dedot                   phase
acopy                   deesser                 photosensitivity
acrossfade              deflate                 pixdesctest
acrossover              deflicker               pixelize
acrusher                deinterlace_qsv         pixscope
acue                    deinterlace_vaapi       pp
addroi                  dejudder                pp7
adeclick                delogo                  premultiply
adeclip                 denoise_vaapi           prewitt
adecorrelate            derain                  prewitt_opencl
adelay                  deshake                 procamp_vaapi
adenorm                 deshake_opencl          program_opencl
aderivative             despill                 pseudocolor
adrawgraph              detelecine              psnr
adrc                    dialoguenhance          pullup
adynamicequalizer       dilation                qp
adynamicsmooth          dilation_opencl         random
aecho                   displace                readeia608
aemphasis               dnn_classify            readvitc
aeval                   dnn_detect              realtime
aevalsrc                dnn_processing          remap
aexciter                doubleweave             remap_opencl
afade                   drawbox                 removegrain
afdelaysrc              drawgraph               removelogo
afftdn                  drawgrid                repeatfields
afftfilt                drawtext                replaygain
afir                    drmeter                 reverse
afireqsrc               dynaudnorm              rgbashift
afirsrc                 earwax                  rgbtestsrc
aformat                 ebur128                 roberts
afreqshift              edgedetect              roberts_opencl
afwtdn                  elbg                    rotate
agate                   entropy                 rubberband
agraphmonitor           epx                     sab
ahistogram              eq                      scale
aiir                    equalizer               scale2ref
aintegral               erosion                 scale_cuda
ainterleave             erosion_opencl          scale_qsv
alatency                estdif                  scale_vaapi
alimiter                exposure                scale_vulkan
allpass                 extractplanes           scdet
allrgb                  extrastereo             scharr
allyuv                  fade                    scroll
aloop                   feedback                segment
alphaextract            fftdnoiz                select
alphamerge              fftfilt                 selectivecolor
amerge                  field                   sendcmd
ametadata               fieldhint               separatefields
amix                    fieldmatch              setdar
amovie                  fieldorder              setfield
amplify                 fillborders             setparams
amultiply               find_rect               setpts
anequalizer             firequalizer            setrange
anlmdn                  flanger                 setsar
anlmf                   flip_vulkan             settb
anlms                   flite                   sharpness_vaapi
anoisesrc               floodfill               shear
anull                   format                  showcqt
anullsink               fps                     showcwt
anullsrc                framepack               showfreqs
apad                    framerate               showinfo
aperms                  framestep               showpalette
aphasemeter             freezedetect            showspatial
aphaser                 freezeframes            showspectrum
aphaseshift             frei0r                  showspectrumpic
apsnr                   frei0r_src              showvolume
apsyclip                fspp                    showwaves
apulsator               fsync                   showwavespic
arealtime               gblur                   shuffleframes
aresample               gblur_vulkan            shufflepixels
areverse                geq                     shuffleplanes
arls                    gradfun                 sidechaincompress
arnndn                  gradients               sidechaingate
asdr                    graphmonitor            sidedata
asegment                grayworld               sierpinski
aselect                 greyedge                signalstats
asendcmd                guided                  signature
asetnsamples            haas                    silencedetect
asetpts                 haldclut                silenceremove
asetrate                haldclutsrc             sinc
asettb                  hdcd                    sine
ashowinfo               headphone               siti
asidedata               hflip                   smartblur
asisdr                  hflip_vulkan            smptebars
asoftclip               highpass                smptehdbars
aspectralstats          highshelf               sobel
asplit                  hilbert                 sobel_opencl
ass                     histeq                  sofalizer
astats                  histogram               spectrumsynth
astreamselect           hqdn3d                  speechnorm
asubboost               hqx                     split
asubcut                 hstack                  spp
asupercut               hstack_qsv              sr
asuperpass              hstack_vaapi            ssim
asuperstop              hsvhold                 ssim360
atadenoise              hsvkey                  stereo3d
atempo                  hue                     stereotools
atilt                   huesaturation           stereowiden
atrim                   hwdownload              streamselect
avectorscope            hwmap                   subtitles
avgblur                 hwupload                super2xsai
avgblur_opencl          hwupload_cuda           superequalizer
avgblur_vulkan          hysteresis              surround
avsynctest              identity                swaprect
axcorrelate             idet                    swapuv
azmq                    il                      tblend
backgroundkey           inflate                 telecine
bandpass                interlace               testsrc
bandreject              interleave              testsrc2
bass                    join                    thistogram
bbox                    kerndeint               threshold
bench                   kirsch                  thumbnail
bilateral               ladspa                  thumbnail_cuda
bilateral_cuda          lagfun                  tile
biquad                  latency                 tiltandshift
bitplanenoise           lenscorrection          tiltshelf
blackdetect             lensfun                 tinterlace
blackframe              libplacebo              tlut2
blend                   libvmaf                 tmedian
blend_vulkan            life                    tmidequalizer
blockdetect             limitdiff               tmix
blurdetect              limiter                 tonemap
bm3d                    loop                    tonemap_opencl
boxblur                 loudnorm                tonemap_vaapi
boxblur_opencl          lowpass                 tpad
bs2b                    lowshelf                transpose
bwdif                   lumakey                 transpose_opencl
bwdif_cuda              lut                     transpose_vaapi
bwdif_vulkan            lut1d                   transpose_vulkan
cas                     lut2                    treble
ccrepack                lut3d                   tremolo
cellauto                lutrgb                  trim
channelmap              lutyuv                  unpremultiply
channelsplit            mandelbrot              unsharp
chorus                  maskedclamp             unsharp_opencl
chromaber_vulkan        maskedmax               untile
chromahold              maskedmerge             uspp
chromakey               maskedmin               v360
chromakey_cuda          maskedthreshold         vaguedenoiser
chromanr                maskfun                 varblur
chromashift             mcdeint                 vectorscope
ciescope                mcompand                vflip
codecview               median                  vflip_vulkan
color                   mergeplanes             vfrdet
color_vulkan            mestimate               vibrance
colorbalance            metadata                vibrato
colorchannelmixer       midequalizer            vidstabdetect
colorchart              minterpolate            vidstabtransform
colorcontrast           mix                     vif
colorcorrect            monochrome              vignette
colorhold               morpho                  virtualbass
colorize                movie                   vmafmotion
colorkey                mpdecimate              volume
colorkey_opencl         mptestsrc               volumedetect
colorlevels             msad                    vpp_qsv
colormap                multiply                vstack
colormatrix             negate                  vstack_qsv
colorspace              nlmeans                 vstack_vaapi
colorspace_cuda         nlmeans_opencl          w3fdif
colorspectrum           nlmeans_vulkan          waveform
colortemperature        nnedi                   weave
compand                 noformat                xbr
compensationdelay       noise                   xcorrelate
concat                  normalize               xfade
convolution             null                    xfade_opencl
convolution_opencl      nullsink                xfade_vulkan
convolve                nullsrc                 xmedian
copy                    openclsrc               xstack
corr                    oscilloscope            xstack_qsv
cover_rect              overlay                 xstack_vaapi
crop                    overlay_cuda            yadif
cropdetect              overlay_opencl          yadif_cuda
crossfeed               overlay_qsv             yaepblur
crystalizer             overlay_vaapi           yuvtestsrc
cue                     overlay_vulkan          zmq
curves                  owdenoise               zoneplate
datascope               pad                     zoompan
dblur                   pad_opencl              zscale
dcshift                 pal100bars
dctdnoiz                pal75bars

Enabled bsfs:
aac_adtstoasc           h264_redundant_pps      pgs_frame_merge
av1_frame_merge         hapqa_extract           prores_metadata
av1_frame_split         hevc_metadata           remove_extradata
av1_metadata            hevc_mp4toannexb        setts
chomp                   imx_dump_header         showinfo
dca_core                media100_to_mjpegb      text2movsub
dts2pts                 mjpeg2jpeg              trace_headers
dump_extradata          mjpega_dump_header      truehd_core
dv_error_marker         mov2textsub             vp9_metadata
eac3_core               mpeg2_metadata          vp9_raw_reorder
evc_frame_merge         mpeg4_unpack_bframes    vp9_superframe
extract_extradata       noise                   vp9_superframe_split
filter_units            null                    vvc_metadata
h264_metadata           opus_metadata           vvc_mp4toannexb
h264_mp4toannexb        pcm_rechunk

Enabled indevs:
dshow                   lavfi                   vfwcap
gdigrab                 libcdio

Enabled outdevs:
caca                    sdl2

release-full external libraries' versions: 

AMF v1.4.34
aom v3.9.1-296-g125fab09fc
aribb24 v1.0.3-5-g5e9be27
aribcaption 1.1.1
AviSynthPlus v3.7.3-70-g2b55ba40
bs2b 3.1.0
chromaprint 1.5.1
codec2 1.2.0-103-gff00a6e2
dav1d 1.4.2-15-g2355eeb
davs2 1.7-1-gb41cf11
ffnvcodec n12.2.72.0-1-g9934f17
flite v2.2-55-g6c9f20d
freetype VER-2-13-2
frei0r v2.3.3-3-gcbb507d
fribidi v1.0.15-1-g3826589
gsm 1.0.22
harfbuzz 9.0.0-23-g788b469a
ladspa-sdk 1.17
lame 3.100
lensfun v0.3.95-1467-gdb4db53f
libass 0.17.3-6-gc5bb87e
libcdio-paranoia 10.2
libgme 0.6.3
libilbc v3.0.4-346-g6adb26d4a4
libjxl v0.10-snapshot-224-gd5f919c7
libopencore-amrnb 0.1.6
libopencore-amrwb 0.1.6
libplacebo v7.349.0
libsoxr 0.1.3
libssh 0.10.6
libtheora 1.1.1
libwebp v1.4.0-65-g74be8e22
oneVPL 2.12
OpenCL-Headers v2024.05.08-5-gd79beab
openmpt libopenmpt-0.6.18-4-g379175121
opus v1.5.2-12-gfc96bb9c
qrencode 4.1.1
quirc 1.2
rav1e p20240612-2-ge34e772
rist 0.2.10
rubberband v1.8.1
SDL prerelease-2.29.2-306-g5d1ca1c8c
shaderc v2024.1-13-g5d0f6ed
shine 3.1.1
snappy 1.1.10
speex Speex-1.2.1-28-g1de1260
srt v1.5.3-87-g84d18ec
SVT-AV1 v2.1.2-61-g21a1154a
twolame 0.4.0
uavs3d v1.1-47-g1fd0491
VAAPI 2.23.0.
vidstab v1.1.1-13-g8dff7ad
vmaf v3.0.0-91-ge7258b3c
vo-amrwbenc 0.1.3
vorbis v1.3.7-10-g84c02369
vpx v1.14.1-326-gf9120b789
vulkan-loader vulkan-sdk-1.3.290.0-3-gbe0e1c3
vvenc v1.12.0-6-g4488526
x264 v0.164.3191
x265 3.6-36-gdd594f59d
xavs2 1.4
xevd 0.5.0
xeve 0.5.1
xvid v1.3.7
zeromq 4.3.5
zimg release-3.0.5-150-g7143181
zvbi v0.2.42-58-ga48ab3a

