import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

export function createForm<T extends object>(defaultValue: T, onSubmit: (formData: T) => void) {
  const formState = reactive<T>(defaultValue)
  const formRef = ref<FormInstance | null>(null)

  async function submitForm() {
    if (formRef.value === null)
      return

    await formRef.value.validate((valid) => {
      if (!valid)
        return

      const formValue = { ...formState }

      onSubmit(formValue as T)
    })
  }

  function resetForm() {
    if (formRef.value === null)
      return

    formRef.value.resetFields()
  }

  return {
    formState,
    formRef,
    submitForm,
    resetForm,
  }
}
