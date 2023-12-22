import type { FormInstance } from 'element-plus'
import type { Ref } from 'vue'
import { reactive, ref } from 'vue'

export function createForm<T extends object>(defaultValue: T, onSubmit: (formData: T, formRef: Ref<FormInstance | null>) => void) {
  const formState = reactive<T>(defaultValue)
  const formRef = ref<FormInstance | null>(null)

  async function submitForm() {
    if (formRef.value === null)
      return

    await formRef.value.validate((valid) => {
      if (!valid)
        return

      const formValue = { ...formState }

      onSubmit(formValue as T, formRef)
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
