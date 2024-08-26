import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {type: String, required: true},
  },
  setup(props) {
    return () => <div class="relative">
      <div class="i-ph-file"/>
      <div class="absolute left-.05em bottom-.05em bg-white text-.3em z-1 lh-1em p-.1em">{props.type}</div>
    </div>;
  }
})
