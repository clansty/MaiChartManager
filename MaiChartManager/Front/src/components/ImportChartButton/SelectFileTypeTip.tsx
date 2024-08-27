import { computed, defineComponent } from "vue";
import { NDrawer, NDrawerContent, NFlex } from "naive-ui";
import FileTypeIcon from "@/components/FileTypeIcon";
import FileContentIcon from "@/components/FileContentIcon";

export default defineComponent({
  props: {
    show: {type: Boolean, required: true},
    closeModal: {type: Function, required: true}
  },
  setup(props, {emit}) {
    const show = computed({
      get: () => props.show,
      set: (val) => props.closeModal()
    })

    return () => <NDrawer v-model:show={show.value} width={500} placement="right">
      <NDrawerContent title="可以选择的文件类型">
        <NFlex vertical size="large">
          包含以下文件的文件夹
          <div class="grid cols-[2fr_1fr] justify-items-center h-50 gap-5">
            <NFlex vertical align="center" class="w-full" size="small">
              <FileContentIcon type="maidata"/>
              maidata.txt
            </NFlex>
            <div class="grid rows-2">
              <NFlex vertical align="center" justify="center" class="w-full" size="small">
                <FileTypeIcon type="mp3" class="text-16"/>
                track.mp3
              </NFlex>
              <NFlex vertical align="center" justify="center" class="w-full" size="small">
                <FileTypeIcon type="jpg" class="text-16"/>
                bg.jpg / bg.png
              </NFlex>
            </div>
          </div>
        </NFlex>
      </NDrawerContent>
    </NDrawer>;
  }
})
