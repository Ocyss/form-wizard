export async function copyToClipboard(text: string) {
  const toast = useToast()
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: '已复制', color: 'success', duration: 500 })
  }
  catch (err) {
    console.log('复制失败', err)
    toast.add({ title: '复制失败', color: 'error', duration: 0 })
  }
}
