import fsDriver from 'unstorage/drivers/fs'

export default defineNitroPlugin(() => {
  useStorage().mount('sites', fsDriver({ base: useRuntimeConfig().private.sitesDir }))
})
