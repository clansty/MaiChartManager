FFmpeg 64-bit shared Windows build from www.gyan.dev

Version: 7.1.1-full_build-www.gyan.dev

License: GPL v3

Source Code: https://github.com/FFmpeg/FFmpeg/commit/db69d06eee

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
gmp                     liblc3                  libvidstab
gnutls                  liblensfun              libvmaf
iconv                   libmodplug              libvo_amrwbenc
ladspa                  libmp3lame              libvorbis
lcms2                   libmysofa               libvpx
libaom                  libopencore_amrnb       libvvenc
libaribb24              libopencore_amrwb       libwebp
libaribcaption          libopenjpeg             libx264
libass                  libopenmpt              libx265
libbluray               libopus                 libxavs2
libbs2b                 libplacebo              libxevd
libcaca                 libqrencode             libxeve
libcdio                 libquirc                libxml2
libcodec2               librav1e                libxvid
libdav1d                librist                 libzimg
libdavs2                librubberband           libzmq
libdvdnav               libshaderc              libzvbi
libdvdread              libshine                lzma
libflite                libsnappy               mediafoundation
libfontconfig           libsoxr                 sdl2
libfreetype             libspeex                zlib
libfribidi              libsrt
libgme                  libssh

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
aac                     g723_1                  pcx
aac_fixed               g729                    pdv
aac_latm                gdv                     pfm
aasc                    gem                     pgm
ac3                     gif                     pgmyuv
ac3_fixed               gremlin_dpcm            pgssub
acelp_kelvin            gsm                     pgx
adpcm_4xm               gsm_ms                  phm
adpcm_adx               h261                    photocd
adpcm_afc               h263                    pictor
adpcm_agm               h263i                   pixlet
adpcm_aica              h263p                   pjs
adpcm_argo              h264                    png
adpcm_ct                h264_cuvid              ppm
adpcm_dtk               h264_qsv                prores
adpcm_ea                hap                     prosumer
adpcm_ea_maxis_xa       hca                     psd
adpcm_ea_r1             hcom                    ptx
adpcm_ea_r2             hdr                     qcelp
adpcm_ea_r3             hevc                    qdm2
adpcm_ea_xas            hevc_cuvid              qdmc
adpcm_g722              hevc_qsv                qdraw
adpcm_g726              hnm4_video              qoa
adpcm_g726le            hq_hqa                  qoi
adpcm_ima_acorn         hqx                     qpeg
adpcm_ima_alp           huffyuv                 qtrle
adpcm_ima_amv           hymt                    r10k
adpcm_ima_apc           iac                     r210
adpcm_ima_apm           idcin                   ra_144
adpcm_ima_cunning       idf                     ra_288
adpcm_ima_dat4          iff_ilbm                ralf
adpcm_ima_dk3           ilbc                    rasc
adpcm_ima_dk4           imc                     rawvideo
adpcm_ima_ea_eacs       imm4                    realtext
adpcm_ima_ea_sead       imm5                    rka
adpcm_ima_iss           indeo2                  rl2
adpcm_ima_moflex        indeo3                  roq
adpcm_ima_mtf           indeo4                  roq_dpcm
adpcm_ima_oki           indeo5                  rpza
adpcm_ima_qt            interplay_acm           rscc
adpcm_ima_rad           interplay_dpcm          rtv1
adpcm_ima_smjpeg        interplay_video         rv10
adpcm_ima_ssi           ipu                     rv20
adpcm_ima_wav           jacosub                 rv30
adpcm_ima_ws            jpeg2000                rv40
adpcm_ms                jpegls                  s302m
adpcm_mtaf              jv                      sami
adpcm_psx               kgv1                    sanm
adpcm_sbpro_2           kmvc                    sbc
adpcm_sbpro_3           lagarith                scpr
adpcm_sbpro_4           lead                    screenpresso
adpcm_swf               libaom_av1              sdx2_dpcm
adpcm_thp               libaribb24              sga
adpcm_thp_le            libaribcaption          sgi
adpcm_vima              libcodec2               sgirle
adpcm_xa                libdav1d                sheervideo
adpcm_xmd               libdavs2                shorten
adpcm_yamaha            libgsm                  simbiosis_imx
adpcm_zork              libgsm_ms               sipr
agm                     libilbc                 siren
aic                     libjxl                  smackaud
alac                    liblc3                  smacker
alias_pix               libopencore_amrnb       smc
als                     libopencore_amrwb       smvjpeg
amrnb                   libopus                 snow
amrwb                   libspeex                sol_dpcm
amv                     libuavs3d               sonic
anm                     libvorbis               sp5x
ansi                    libvpx_vp8              speedhq
anull                   libvpx_vp9              speex
apac                    libxevd                 srgc
ape                     libzvbi_teletext        srt
apng                    loco                    ssa
aptx                    lscr                    stl
aptx_hd                 m101                    subrip
arbc                    mace3                   subviewer
argo                    mace6                   subviewer1
ass                     magicyuv                sunrast
asv1                    mdec                    svq1
asv2                    media100                svq3
atrac1                  metasound               tak
atrac3                  microdvd                targa
atrac3al                mimic                   targa_y216
atrac3p                 misc4                   tdsc
atrac3pal               mjpeg                   text
atrac9                  mjpeg_cuvid             theora
aura                    mjpeg_qsv               thp
aura2                   mjpegb                  tiertexseqvideo
av1                     mlp                     tiff
av1_cuvid               mmvideo                 tmv
av1_qsv                 mobiclip                truehd
avrn                    motionpixels            truemotion1
avrp                    movtext                 truemotion2
avs                     mp1                     truemotion2rt
avui                    mp1float                truespeech
bethsoftvid             mp2                     tscc
bfi                     mp2float                tscc2
bink                    mp3                     tta
binkaudio_dct           mp3adu                  twinvq
binkaudio_rdft          mp3adufloat             txd
bintext                 mp3float                ulti
bitpacked               mp3on4                  utvideo
bmp                     mp3on4float             v210
bmv_audio               mpc7                    v210x
bmv_video               mpc8                    v308
bonk                    mpeg1_cuvid             v408
brender_pix             mpeg1video              v410
c93                     mpeg2_cuvid             vb
cavs                    mpeg2_qsv               vble
cbd2_dpcm               mpeg2video              vbn
ccaption                mpeg4                   vc1
cdgraphics              mpeg4_cuvid             vc1_cuvid
cdtoons                 mpegvideo               vc1_qsv
cdxl                    mpl2                    vc1image
cfhd                    msa1                    vcr1
cinepak                 mscc                    vmdaudio
clearvideo              msmpeg4v1               vmdvideo
cljr                    msmpeg4v2               vmix
cllc                    msmpeg4v3               vmnc
comfortnoise            msnsiren                vnull
cook                    msp2                    vorbis
cpia                    msrle                   vp3
cri                     mss1                    vp4
cscd                    mss2                    vp5
cyuv                    msvideo1                vp6
dca                     mszh                    vp6a
dds                     mts2                    vp6f
derf_dpcm               mv30                    vp7
dfa                     mvc1                    vp8
dfpwm                   mvc2                    vp8_cuvid
dirac                   mvdv                    vp8_qsv
dnxhd                   mvha                    vp9
dolby_e                 mwsc                    vp9_cuvid
dpx                     mxpeg                   vp9_qsv
dsd_lsbf                nellymoser              vplayer
dsd_lsbf_planar         notchlc                 vqa
dsd_msbf                nuv                     vqc
dsd_msbf_planar         on2avc                  vvc
dsicinaudio             opus                    vvc_qsv
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
g2m                     pcm_vidc

Enabled encoders:
a64multi                hevc_vaapi              pcm_s8
a64multi5               hevc_vulkan             pcm_s8_planar
aac                     huffyuv                 pcm_u16be
aac_mf                  jpeg2000                pcm_u16le
ac3                     jpegls                  pcm_u24be
ac3_fixed               libaom_av1              pcm_u24le
ac3_mf                  libcodec2               pcm_u32be
adpcm_adx               libgsm                  pcm_u32le
adpcm_argo              libgsm_ms               pcm_u8
adpcm_g722              libilbc                 pcm_vidc
adpcm_g726              libjxl                  pcx
adpcm_g726le            liblc3                  pfm
adpcm_ima_alp           libmp3lame              pgm
adpcm_ima_amv           libopencore_amrnb       pgmyuv
adpcm_ima_apm           libopenjpeg             phm
adpcm_ima_qt            libopus                 png
adpcm_ima_ssi           librav1e                ppm
adpcm_ima_wav           libshine                prores
adpcm_ima_ws            libspeex                prores_aw
adpcm_ms                libsvtav1               prores_ks
adpcm_swf               libtheora               qoi
adpcm_yamaha            libtwolame              qtrle
alac                    libvo_amrwbenc          r10k
alias_pix               libvorbis               r210
amv                     libvpx_vp8              ra_144
anull                   libvpx_vp9              rawvideo
apng                    libvvenc                roq
aptx                    libwebp                 roq_dpcm
aptx_hd                 libwebp_anim            rpza
ass                     libx264                 rv10
asv1                    libx264rgb              rv20
asv2                    libx265                 s302m
av1_amf                 libxavs2                sbc
av1_nvenc               libxeve                 sgi
av1_qsv                 libxvid                 smc
av1_vaapi               ljpeg                   snow
avrp                    magicyuv                sonic
avui                    mjpeg                   sonic_ls
bitpacked               mjpeg_qsv               speedhq
bmp                     mjpeg_vaapi             srt
cfhd                    mlp                     ssa
cinepak                 movtext                 subrip
cljr                    mp2                     sunrast
comfortnoise            mp2fixed                svq1
dca                     mp3_mf                  targa
dfpwm                   mpeg1video              text
dnxhd                   mpeg2_qsv               tiff
dpx                     mpeg2_vaapi             truehd
dvbsub                  mpeg2video              tta
dvdsub                  mpeg4                   ttml
dvvideo                 msmpeg4v2               utvideo
dxv                     msmpeg4v3               v210
eac3                    msrle                   v308
exr                     msvideo1                v408
ffv1                    nellymoser              v410
ffvhuff                 opus                    vbn
fits                    pam                     vc2
flac                    pbm                     vnull
flashsv                 pcm_alaw                vorbis
flashsv2                pcm_bluray              vp8_vaapi
flv                     pcm_dvd                 vp9_qsv
g723_1                  pcm_f32be               vp9_vaapi
gif                     pcm_f32le               wavpack
h261                    pcm_f64be               wbmp
h263                    pcm_f64le               webvtt
h263p                   pcm_mulaw               wmav1
h264_amf                pcm_s16be               wmav2
h264_mf                 pcm_s16be_planar        wmv1
h264_nvenc              pcm_s16le               wmv2
h264_qsv                pcm_s16le_planar        wrapped_avframe
h264_vaapi              pcm_s24be               xbm
h264_vulkan             pcm_s24daud             xface
hap                     pcm_s24le               xsub
hdr                     pcm_s24le_planar        xwd
hevc_amf                pcm_s32be               y41p
hevc_d3d12va            pcm_s32le               yuv4
hevc_mf                 pcm_s32le_planar        zlib
hevc_nvenc              pcm_s64be               zmbv
hevc_qsv                pcm_s64le

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
aptx                    image_pgx_pipe          rcwt
aptx_hd                 image_phm_pipe          realtext
aqtitle                 image_photocd_pipe      redspark
argo_asf                image_pictor_pipe       rka
argo_brp                image_png_pipe          rl2
argo_cvg                image_ppm_pipe          rm
asf                     image_psd_pipe          roq
asf_o                   image_qdraw_pipe        rpl
ass                     image_qoi_pipe          rsd
ast                     image_sgi_pipe          rso
au                      image_sunrast_pipe      rtp
av1                     image_svg_pipe          rtsp
avi                     image_tiff_pipe         s337m
avisynth                image_vbn_pipe          sami
avr                     image_webp_pipe         sap
avs                     image_xbm_pipe          sbc
avs2                    image_xpm_pipe          sbg
avs3                    image_xwd_pipe          scc
bethsoftvid             imf                     scd
bfi                     ingenient               sdns
bfstm                   ipmovie                 sdp
bink                    ipu                     sdr2
binka                   ircam                   sds
bintext                 iss                     sdx
bit                     iv8                     segafilm
bitpacked               ivf                     ser
bmv                     ivr                     sga
boa                     jacosub                 shorten
bonk                    jpegxl_anim             siff
brstm                   jv                      simbiosis_imx
c93                     kux                     sln
caf                     kvag                    smacker
cavsvideo               laf                     smjpeg
cdg                     lc3                     smush
cdxl                    libgme                  sol
cine                    libmodplug              sox
codec2                  libopenmpt              spdif
codec2raw               live_flv                srt
concat                  lmlm4                   stl
dash                    loas                    str
data                    lrc                     subviewer
daud                    luodat                  subviewer1
dcstr                   lvf                     sup
derf                    lxf                     svag
dfa                     m4v                     svs
dfpwm                   matroska                swf
dhav                    mca                     tak
dirac                   mcc                     tedcaptions
dnxhd                   mgsts                   thp
dsf                     microdvd                threedostr
dsicin                  mjpeg                   tiertexseq
dss                     mjpeg_2000              tmv
dts                     mlp                     truehd
dtshd                   mlv                     tta
dv                      mm                      tty
dvbsub                  mmf                     txd
dvbtxt                  mods                    ty
dvdvideo                moflex                  usm
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
a64                     h263                    pcm_s24be
ac3                     h264                    pcm_s24le
ac4                     hash                    pcm_s32be
adts                    hds                     pcm_s32le
adx                     hevc                    pcm_s8
aea                     hls                     pcm_u16be
aiff                    iamf                    pcm_u16le
alp                     ico                     pcm_u24be
amr                     ilbc                    pcm_u24le
amv                     image2                  pcm_u32be
apm                     image2pipe              pcm_u32le
apng                    ipod                    pcm_u8
aptx                    ircam                   pcm_vidc
aptx_hd                 ismv                    psp
argo_asf                ivf                     rawvideo
argo_cvg                jacosub                 rcwt
asf                     kvag                    rm
asf_stream              latm                    roq
ass                     lc3                     rso
ast                     lrc                     rtp
au                      m4v                     rtp_mpegts
avi                     matroska                rtsp
avif                    matroska_audio          sap
avm2                    md5                     sbc
avs2                    microdvd                scc
avs3                    mjpeg                   segafilm
bit                     mkvtimestamp_v2         segment
caf                     mlp                     smjpeg
cavsvideo               mmf                     smoothstreaming
chromaprint             mov                     sox
codec2                  mp2                     spdif
codec2raw               mp3                     spx
crc                     mp4                     srt
dash                    mpeg1system             stream_segment
data                    mpeg1vcd                streamhash
daud                    mpeg1video              sup
dfpwm                   mpeg2dvd                swf
dirac                   mpeg2svcd               tee
dnxhd                   mpeg2video              tg2
dts                     mpeg2vob                tgp
dv                      mpegts                  truehd
eac3                    mpjpeg                  tta
evc                     mxf                     ttml
f4v                     mxf_d10                 uncodedframecrc
ffmetadata              mxf_opatom              vc1
fifo                    null                    vc1t
filmstrip               nut                     voc
fits                    obu                     vvc
flac                    oga                     w64
flv                     ogg                     wav
framecrc                ogv                     webm
framehash               oma                     webm_chunk
framemd5                opus                    webm_dash_manifest
g722                    pcm_alaw                webp
g723_1                  pcm_f32be               webvtt
g726                    pcm_f32le               wsaud
g726le                  pcm_f64be               wtv
gif                     pcm_f64le               wv
gsm                     pcm_mulaw               yuv4mpegpipe
gxf                     pcm_s16be
h261                    pcm_s16le

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
a3dscope                deband                  pan
aap                     deblock                 perlin
abench                  decimate                perms
abitscope               deconvolve              perspective
acompressor             dedot                   phase
acontrast               deesser                 photosensitivity
acopy                   deflate                 pixdesctest
acrossfade              deflicker               pixelize
acrossover              deinterlace_qsv         pixscope
acrusher                deinterlace_vaapi       pp
acue                    dejudder                pp7
addroi                  delogo                  premultiply
adeclick                denoise_vaapi           prewitt
adeclip                 deshake                 prewitt_opencl
adecorrelate            deshake_opencl          procamp_vaapi
adelay                  despill                 program_opencl
adenorm                 detelecine              pseudocolor
aderivative             dialoguenhance          psnr
adrawgraph              dilation                pullup
adrc                    dilation_opencl         qp
adynamicequalizer       displace                qrencode
adynamicsmooth          doubleweave             qrencodesrc
aecho                   drawbox                 quirc
aemphasis               drawbox_vaapi           random
aeval                   drawgraph               readeia608
aevalsrc                drawgrid                readvitc
aexciter                drawtext                realtime
afade                   drmeter                 remap
afdelaysrc              dynaudnorm              remap_opencl
afftdn                  earwax                  removegrain
afftfilt                ebur128                 removelogo
afir                    edgedetect              repeatfields
afireqsrc               elbg                    replaygain
afirsrc                 entropy                 reverse
aformat                 epx                     rgbashift
afreqshift              eq                      rgbtestsrc
afwtdn                  equalizer               roberts
agate                   erosion                 roberts_opencl
agraphmonitor           erosion_opencl          rotate
ahistogram              estdif                  rubberband
aiir                    exposure                sab
aintegral               extractplanes           scale
ainterleave             extrastereo             scale2ref
alatency                fade                    scale_cuda
alimiter                feedback                scale_qsv
allpass                 fftdnoiz                scale_vaapi
allrgb                  fftfilt                 scale_vulkan
allyuv                  field                   scdet
aloop                   fieldhint               scharr
alphaextract            fieldmatch              scroll
alphamerge              fieldorder              segment
amerge                  fillborders             select
ametadata               find_rect               selectivecolor
amix                    firequalizer            sendcmd
amovie                  flanger                 separatefields
amplify                 flip_vulkan             setdar
amultiply               flite                   setfield
anequalizer             floodfill               setparams
anlmdn                  format                  setpts
anlmf                   fps                     setrange
anlms                   framepack               setsar
anoisesrc               framerate               settb
anull                   framestep               sharpness_vaapi
anullsink               freezedetect            shear
anullsrc                freezeframes            showcqt
apad                    frei0r                  showcwt
aperms                  frei0r_src              showfreqs
aphasemeter             fspp                    showinfo
aphaser                 fsync                   showpalette
aphaseshift             gblur                   showspatial
apsnr                   gblur_vulkan            showspectrum
apsyclip                geq                     showspectrumpic
apulsator               gradfun                 showvolume
arealtime               gradients               showwaves
aresample               graphmonitor            showwavespic
areverse                grayworld               shuffleframes
arls                    greyedge                shufflepixels
arnndn                  guided                  shuffleplanes
asdr                    haas                    sidechaincompress
asegment                haldclut                sidechaingate
aselect                 haldclutsrc             sidedata
asendcmd                hdcd                    sierpinski
asetnsamples            headphone               signalstats
asetpts                 hflip                   signature
asetrate                hflip_vulkan            silencedetect
asettb                  highpass                silenceremove
ashowinfo               highshelf               sinc
asidedata               hilbert                 sine
asisdr                  histeq                  siti
asoftclip               histogram               smartblur
aspectralstats          hqdn3d                  smptebars
asplit                  hqx                     smptehdbars
ass                     hstack                  sobel
astats                  hstack_qsv              sobel_opencl
astreamselect           hstack_vaapi            sofalizer
asubboost               hsvhold                 spectrumsynth
asubcut                 hsvkey                  speechnorm
asupercut               hue                     split
asuperpass              huesaturation           spp
asuperstop              hwdownload              ssim
atadenoise              hwmap                   ssim360
atempo                  hwupload                stereo3d
atilt                   hwupload_cuda           stereotools
atrim                   hysteresis              stereowiden
avectorscope            iccdetect               streamselect
avgblur                 iccgen                  subtitles
avgblur_opencl          identity                super2xsai
avgblur_vulkan          idet                    superequalizer
avsynctest              il                      surround
axcorrelate             inflate                 swaprect
azmq                    interlace               swapuv
backgroundkey           interleave              tblend
bandpass                join                    telecine
bandreject              kerndeint               testsrc
bass                    kirsch                  testsrc2
bbox                    ladspa                  thistogram
bench                   lagfun                  threshold
bilateral               latency                 thumbnail
bilateral_cuda          lenscorrection          thumbnail_cuda
biquad                  lensfun                 tile
bitplanenoise           libplacebo              tiltandshift
blackdetect             libvmaf                 tiltshelf
blackframe              life                    tinterlace
blend                   limitdiff               tlut2
blend_vulkan            limiter                 tmedian
blockdetect             loop                    tmidequalizer
blurdetect              loudnorm                tmix
bm3d                    lowpass                 tonemap
boxblur                 lowshelf                tonemap_opencl
boxblur_opencl          lumakey                 tonemap_vaapi
bs2b                    lut                     tpad
bwdif                   lut1d                   transpose
bwdif_cuda              lut2                    transpose_opencl
bwdif_vulkan            lut3d                   transpose_vaapi
cas                     lutrgb                  transpose_vulkan
ccrepack                lutyuv                  treble
cellauto                mandelbrot              tremolo
channelmap              maskedclamp             trim
channelsplit            maskedmax               unpremultiply
chorus                  maskedmerge             unsharp
chromaber_vulkan        maskedmin               unsharp_opencl
chromahold              maskedthreshold         untile
chromakey               maskfun                 uspp
chromakey_cuda          mcdeint                 v360
chromanr                mcompand                vaguedenoiser
chromashift             median                  varblur
ciescope                mergeplanes             vectorscope
codecview               mestimate               vflip
color                   metadata                vflip_vulkan
color_vulkan            midequalizer            vfrdet
colorbalance            minterpolate            vibrance
colorchannelmixer       mix                     vibrato
colorchart              monochrome              vidstabdetect
colorcontrast           morpho                  vidstabtransform
colorcorrect            movie                   vif
colorhold               mpdecimate              vignette
colorize                mptestsrc               virtualbass
colorkey                msad                    vmafmotion
colorkey_opencl         multiply                volume
colorlevels             negate                  volumedetect
colormap                nlmeans                 vpp_qsv
colormatrix             nlmeans_opencl          vstack
colorspace              nlmeans_vulkan          vstack_qsv
colorspace_cuda         nnedi                   vstack_vaapi
colorspectrum           noformat                w3fdif
colortemperature        noise                   waveform
compand                 normalize               weave
compensationdelay       null                    xbr
concat                  nullsink                xcorrelate
convolution             nullsrc                 xfade
convolution_opencl      openclsrc               xfade_opencl
convolve                oscilloscope            xfade_vulkan
copy                    overlay                 xmedian
corr                    overlay_cuda            xpsnr
cover_rect              overlay_opencl          xstack
crop                    overlay_qsv             xstack_qsv
cropdetect              overlay_vaapi           xstack_vaapi
crossfeed               overlay_vulkan          yadif
crystalizer             owdenoise               yadif_cuda
cue                     pad                     yaepblur
curves                  pad_opencl              yuvtestsrc
datascope               pad_vaapi               zmq
dblur                   pal100bars              zoneplate
dcshift                 pal75bars               zoompan
dctdnoiz                palettegen              zscale
ddagrab                 paletteuse

Enabled bsfs:
aac_adtstoasc           h264_mp4toannexb        pcm_rechunk
av1_frame_merge         h264_redundant_pps      pgs_frame_merge
av1_frame_split         hapqa_extract           prores_metadata
av1_metadata            hevc_metadata           remove_extradata
chomp                   hevc_mp4toannexb        setts
dca_core                imx_dump_header         showinfo
dovi_rpu                media100_to_mjpegb      text2movsub
dts2pts                 mjpeg2jpeg              trace_headers
dump_extradata          mjpega_dump_header      truehd_core
dv_error_marker         mov2textsub             vp9_metadata
eac3_core               mpeg2_metadata          vp9_raw_reorder
evc_frame_merge         mpeg4_unpack_bframes    vp9_superframe
extract_extradata       noise                   vp9_superframe_split
filter_units            null                    vvc_metadata
h264_metadata           opus_metadata           vvc_mp4toannexb

Enabled indevs:
dshow                   lavfi                   vfwcap
gdigrab                 libcdio

Enabled outdevs:
caca                    sdl2

release-full external libraries' versions: 

AMF v1.4.36.0
aom v3.12.0-20-g20f697ad51
aribb24 v1.0.3-5-g5e9be27
aribcaption 1.1.1
AviSynthPlus v3.7.3-211-gb038d022
bs2b 3.1.0
chromaprint 1.5.1
codec2 1.2.0-106-g96e8a19c
dav1d 1.5.1-2-gcaef968
davs2 1.7-1-gb41cf11
dvdnav 6.1.1-23-g9831fe0
dvdread 6.1.3-9-gba2227b
ffnvcodec n13.0.19.0-1-gf2fb9b3
flite v2.2-55-g6c9f20d
freetype VER-2-13-3
frei0r v2.3.3-9-g2328ce3
fribidi v1.0.16-2-gb28f43b
gsm 1.0.22
harfbuzz 10.4.0-151-g79c991e1
ladspa-sdk 1.17
lame 3.100
lc3 1.1.3
lcms2 2.16
lensfun v0.3.95-1659-g956de215
libass 0.17.3-79-g1b69955
libcdio-paranoia 10.2
libgme 0.6.3
libilbc v3.0.4-346-g6adb26d4a4
libopencore-amrnb 0.1.6
libopencore-amrwb 0.1.6
libplacebo v7.349.0-38-g02f4f98
libsoxr 0.1.3
libssh 0.11.1
libtheora 1.1.1
libwebp v1.5.0-12-g1d86819f
oneVPL 2.14
OpenCL-Headers v2024.10.24-3-g2c9ff0c
openmpt libopenmpt-0.6.22-19-g9ae5dfb5b
opus v1.5.2-73-gc79a9bd1
qrencode 4.1.1
quirc 1.2
rav1e p20250225
rist 0.2.12
rubberband v1.8.1
SDL release-2.32.0-15-g22a87a22c
shaderc v2025.1-1-g8be073a
shine 3.1.1
snappy 1.2.1
speex Speex-1.2.1-45-g4e231b4
srt v1.5.4-25-g697dce0
SVT-AV1 v3.0.0-18-gd653d6c1
twolame 0.4.0
uavs3d v1.1-47-g1fd0491
VAAPI 2.23.0.
vidstab v1.1.1-14-gd2d55a8
vmaf v3.0.0-107-g4db7c0c8
vo-amrwbenc 0.1.3
vorbis v1.3.7-10-g84c02369
vpx v1.15.0-65-g95afae324
vulkan-loader v1.4.310
vvenc v1.13.0-15-g66bf626
x264 v0.164.3204
x265 4.1-110-g0e0eee580
xavs2 1.4
xevd 0.5.0
xeve 0.5.1
xvid v1.3.7
zeromq 4.3.5
zimg release-3.0.5-197-g9a9a8ea
zvbi v0.2.43-8-g348a442

