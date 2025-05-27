import { computed } from "vue";
import { modInfo, modUpdateInfo } from "@/store/refs";

function compareVersions(v1: string, v2: string) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] || 0; // 默认值为 0
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;  // v1 大于 v2
    if (num1 < num2) return -1; // v1 小于 v2
  }

  return 0; // v1 等于 v2
}

export const shouldShowUpdate = computed(() => {
  if (!modInfo.value?.aquaMaiInstalled) return true;
  if (!modInfo.value?.aquaMaiVersion) return true;
  let currentVersion = modInfo.value.aquaMaiVersion;
  if (currentVersion.includes('-')) {
    currentVersion = currentVersion.split('-')[0];
  }

  const defaultVersionInfo =
    modUpdateInfo.value?.find(it => it.default) ||
    modUpdateInfo.value?.[0] || { type: 'builtin' };
  let latestVersion = defaultVersionInfo.type === "builtin" ? modInfo.value!.bundledAquaMaiVersion! : defaultVersionInfo.version!;
  if (latestVersion.startsWith('v')) {
    latestVersion = latestVersion.substring(1);
  }

  return compareVersions(currentVersion, latestVersion) < 0;
})
