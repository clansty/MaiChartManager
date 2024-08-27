import { defineComponent, PropType } from "vue";

const EXAMPLES = {
  maidata: `&name=
&artist=
&first=
&des=

&level_5=
&inote_5=(182)
{2},,D6/E6,D4/E4,A5/B5,A4/B4,A6/D7,A3/D3/Ch[2:1],E2,{4}1x,72,
{4}5-8[1:1]/4,4,4,4,3,2,
{8}81,8/1-3[8:1],,{4},8-6[8:1],,1-7[8:1]*-3[8:1],,
{8}64,64,,81,,53,5bxpp4[8:3]/3bxqq4[8:3],{4},,,
{8}24,24,,75,75,,{4}8-5[8:1]/1-4[8:1],81,
{4}2h[4:1],4,{8}3,3,4,52,,74,74,,81,,
{8}43,51,,76,84,,7,1<3[8:3],2,3bx,{4},,5^8[8:1]/4^1[8:1],,`,
  ma2: `VERSION\t0.00.00\t1.04.00
FES_MODE\t0
BPM_DEF\t182.000\t182.000\t182.000\t182.000
MET_DEF\t4\t4
RESOLUTION\t384
CLK_DEF\t384
COMPATIBLE_CODE\tMA2

BPM\t0\t0\t182.000
MET\t0\t0\t4\t4

NMTTP\t2\t0\t5\tE\t0\tM1
NMTTP\t2\t0\t5\tD\t0\tM1
NMTTP\t2\t192\t3\tE\t0\tM1
NMTTP\t2\t192\t3\tD\t0\tM1
NMTTP\t3\t0\t4\tB\t0\tM1
NMTTP\t3\t0\t4\tA\t0\tM1`
}

export default defineComponent({
  props: {
    type: {type: String as PropType<keyof typeof EXAMPLES>, required: true},
  },
  setup(props) {
    return () => <div class="grid cols-[1fr_2rem] rows-[2rem_1fr] relative h-full w-full" style={{'--border': '3px', '--border-color': '#525252'}}>
      {/*<div class="absolute right--2px top--2px border-l-2 border-b-2 border-t-none border-r-none border-solid bg-white h-10 w-10 box-border"/>*/}

      <div class="b-0 b-l-width-[var(--border)] b-t-width-[var(--border)] b-solid rounded-tl-1 b-[var(--border-color)]"/>
      <div class="b-0 b-l-width-[var(--border)] b-b-width-[var(--border)] b-solid z-1 rounded-bl-1 b-[var(--border-color)]" style={{
        background: 'linear-gradient(45deg, #d4d4d4 calc(50% - var(--border)), var(--border-color) calc(50% - var(--border)), var(--border-color) 50%, white 50%)',
      }}/>
      <div class="b-0 b-l-width-[var(--border)] b-b-width-[var(--border)] b-solid rounded-bl-1 b-[var(--border-color)]"/>
      <div class="b-0 b-r-width-[var(--border)] b-b-width-[var(--border)] b-solid rounded-br-1 b-[var(--border-color)]"/>

      <div class="p-2 of-hidden h-full w-full absolute">
        <pre class="text-3 h-full m-0 of-hidden">{EXAMPLES[props.type]}</pre>
      </div>
    </div>;
  }
})
