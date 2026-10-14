import { defineComponent, type PropType } from 'vue';

export const ProblemsDisplay = defineComponent({
  props: {
    problems: {
      type: Array as PropType<readonly string[]>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="flex items-center gap-1 text-orange-6 text-sm">
        <div class="i-carbon:warning-alt shrink-0" />
        <span>{props.problems.join('；')}</span>
      </div>
    );
  },
});
