import { reactive } from 'vue'

type TFormState<F extends Exclude<object, any[]>> = {
  [X in keyof F]: {
    value: F[X]
    error: string | undefined
  };
}

function generateFormState<F extends Exclude<object, any[]>>(defaultValue: F) {
  return Object.keys(defaultValue).reduce<TFormState<F>>((acc, key) => {
    acc[key as keyof F] = {
      value: defaultValue[key as keyof F],
      error: undefined,
    }

    return acc
  }, {} as TFormState<F>)
}

export function crateForm<F extends Exclude<object, any[]>>(defaultValue: F) {
  const formState = reactive<TFormState<F>>(generateFormState(defaultValue))
}
