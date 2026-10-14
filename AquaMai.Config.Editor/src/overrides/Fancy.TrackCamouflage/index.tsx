import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const url = 'https://on9.moe/laundry/camouflage.html';

    return () => <div class="m-l-35">
      <a target="_blank" rel="noopener noreferrer" href={url}>
        {t('mod.trackCamouflage.viewDoc')}
      </a>
    </div>
  },
});
