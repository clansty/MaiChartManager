import { defineComponent, ref } from "vue";
import { NButton, NFlex, NForm, NFormItem, NInputNumber, NModal, NRadio, NSelect } from "naive-ui";
import { assetDirs, musicList, selectMusicId, updateMusicList } from "@/store/refs";
import dxIcon from "@/assets/dxIcon.png";
import stdIcon from "@/assets/stdIcon.png";
import api from "@/client/api";

export default defineComponent({
  setup() {
    const show = ref(false);
    const id = ref(0);

    const showDialog = () => {
      id.value = 0;
      for (const existedMusic of musicList.value) {
        if (id.value < existedMusic.id! % 1e4) {
          id.value = existedMusic.id! % 1e4;
        }
      }
      id.value++;
      show.value = true;
    }

    const save = async () => {
      show.value = false;
      await api.AddMusic(id.value);
      await updateMusicList();
      selectMusicId.value = id.value;
    }

    return () => (
      <NButton secondary onClick={showDialog}>
        创建乐曲

        <NModal
          preset="card"
          class="w-[min(30vw,25em)]"
          title={`创建乐曲`}
          v-model:show={show.value}
        >{{
          default: () => <NForm label-placement="left" labelWidth="5em" showFeedback={false}>
            <NFlex vertical size="large">
              <NFormItem label="ID">
                <NInputNumber v-model:value={id.value} class="w-full" min={1} max={2e4-1}/>
              </NFormItem>
              <NFormItem label="谱面类型">
                <NFlex>
                  <NRadio checked={id.value < 1e4} onUpdateChecked={() => id.value -= 1e4}>
                    <img src={stdIcon} class="h-1.5em mt--0.6"/>
                  </NRadio>
                  <NRadio checked={id.value >= 1e4} onUpdateChecked={() => id.value += 1e4}>
                    <img src={dxIcon} class="h-1.5em mt--0.6"/>
                  </NRadio>
                </NFlex>
              </NFormItem>
            </NFlex>
          </NForm>,
          footer: () => <NFlex justify="end">
            <NButton onClick={save}>确定</NButton>
          </NFlex>
        }}</NModal>
      </NButton>
    );
  }
});
