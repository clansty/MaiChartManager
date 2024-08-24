import { defineComponent } from "vue";
import { NFlex, NPopover } from "naive-ui";

export default defineComponent({
  props: {
    problems: Array,
  },
  setup(props) {
    return () => !!props.problems?.length && <NPopover trigger="hover">
      {{
        // 它又不居中
        trigger: () => <div class="text-#f0a020 i-material-symbols-warning-outline-rounded text-2em translate-y-.3"/>,
        default: () => <NFlex vertical>
          {props.problems!.map(p => <div>{p}</div>)}
        </NFlex>
      }}
    </NPopover>;
  }
})
