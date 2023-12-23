import type { FormInstance } from 'element-plus'
import type { Ref } from 'vue'
import { nextTick, ref, toRaw, unref } from 'vue'

export function createForm<T extends object>(defaultValue: T | (() => T), onSubmit: (formData: T, formRef: Ref<FormInstance | null>) => void) {
  function genFormData() {
    return typeof defaultValue === 'function' ? { ...defaultValue() } : { ...defaultValue }
  }

  const formState = ref<T>(genFormData())
  const formRef = ref<FormInstance | null>(null)

  async function submitForm() {
    if (formRef.value === null)
      return

    await formRef.value.validate((valid) => {
      if (!valid)
        return

      const formValue = toRaw(unref(formState))

      onSubmit(formValue as T, formRef)
    })
  }

  function resetForm() {
    if (formRef.value === null)
      return

    nextTick(() => {
      // @ts-expect-error IDk wtF is happening here
      formState.value = genFormData()

      formRef.value?.resetFields()
    })
  }

  return {
    formState,
    formRef,
    submitForm,
    resetForm,
  }
}
