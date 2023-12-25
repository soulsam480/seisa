import type { FormInstance } from 'element-plus'
import type { Ref } from 'vue'
import { nextTick, ref, toValue } from 'vue'

/**
 * Creates a form object that can be used with the
 * element-plus form component
 *
 * @param defaultValue the default value of the form.
 * when it's a function, it will be called to generate the default value
 */
export function createForm<T extends object>(defaultValue: T | (() => T), onSubmit: (formData: T, formRef: Ref<FormInstance | null>) => void) {
  function genFormData() {
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  }

  const formState = ref<T>(genFormData())
  const formRef = ref<FormInstance | null>(null)

  async function submitForm() {
    if (formRef.value === null)
      return

    const isValid = await formRef.value.validate()

    if (!isValid)
      return

    /**
     * unwrap the form state object so that we can
     * use the class methods on the form object
     */
    const formValue = toValue(formState)

    onSubmit(formValue as T, formRef)
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
