<script setup lang='ts' generic="TSchema extends readonly Record<string, Struct<any, any>>">
import { ElButton } from 'element-plus'
import { type Infer, type Struct, validate } from 'superstruct'
import type { PartialDeep } from 'type-fest'
import type { Ref, UnwrapRef } from 'vue'
import { computed, markRaw, onBeforeMount, reactive, ref, toRaw, toRef, toValue, useSlots, watch } from 'vue'

// we need this for error messages
import 'element-plus/es/components/form/style/css'

const props = withDefaults(defineProps<{
  /**
   * validation schema for each step
   */
  schema: TSchema
  /**
   * default form data for wizard steps
   */
  defaultValue?: PartialDeep<TWizardFormData>
}>(), {
  defaultValue: {} as any,
})

const emits = defineEmits<{
  (e: 'submit', data: TWizardFormData): void
}>()

defineSlots<IWizardSlots & TStepSlots>()

// -------------
type TStepKey = keyof TSchema

type TErrorKeysForStep<T extends TStepKey> =
  // 1. infer type from struct
  TSchema[T] extends Struct<infer Type, infer _J> ?
    // 2. if type is array, return step name
    Type extends any[] ? T
    // 3. if type is object, infer key type
      : Type extends object ?
        Type extends Record<infer I, infer _V>
          ? I
          : T
        : T
    : T

/**
 * wizard form data inferred from schema
 */
type TWizardFormData = {
  [K in TStepKey]: Infer<TSchema[K]>
}

/**
 * wizard slots
 */
interface IWizardSlots {
  navigation: (props: {
    next: () => void
    previous: () => void
  }) => any
}

interface IFormState {
  hasValidated: boolean
  errors: Record<string, string | undefined> | null
  currentStep: TStepKey
}

/**
 * step slots
 * @throws error if slot for a step is not provided
 */
type TStepSlots = {
  [K in TStepKey]: (params: {
    /**
     * step form data accessor
     */
    state: Ref<TWizardFormData[K]>
    /**
     * step errors
     */
    errors: Record<TErrorKeysForStep<K>, string | undefined>
  }) => any
}

// -------------

const INTERNAL_SLOTS = markRaw(['navigation'] as const)

const steps = toValue<TStepKey[]>(() => Object.keys(props.schema))

const formState = ref<IFormState>({
  errors: null,
  hasValidated: false,
  currentStep: steps[0],
})

const formData = reactive<TWizardFormData>(props.defaultValue as any)

function createFormDataAccessors(steps: readonly TStepKey[]) {
  return steps.reduce<{ [K in TStepKey]: Ref<TWizardFormData[K]> }>((acc, step) => {
    acc[step] = toRef(formData, step as any)

    return acc
  }, {} as any)
}

/**
 * form data accessors for steps
 * these are exposed as refs, so they maintain the reactive connection to parent
 * @private
 */
const _formAccessors = createFormDataAccessors(steps)

const currentStep = computed<TStepKey>({
  get() {
    return formState.value.currentStep as TStepKey
  },
  set(value) {
    formState.value.currentStep = value as unknown as UnwrapRef<TStepKey>
  },
})

const currentStepIndex = computed(() => steps.indexOf(currentStep.value))

const disableNext = computed(() => steps.length === (currentStepIndex.value + 1))

const disablePrevious = computed(() => currentStepIndex.value === 0)

function validateForm(stepFormData: any) {
  formState.value.hasValidated = false

  const [err, _] = validate(stepFormData, props.schema[currentStep.value as TStepKey])

  if (err === undefined) {
    formState.value.errors = null
    formState.value.hasValidated = true

    return null
  }

  const errors = err.failures().reduce<Record<string, string>>((acc, curr) => {
    const path: string = curr.key ?? currentStep.value

    acc[path] = curr.message

    return acc
  }, {})

  formState.value.errors = errors
  formState.value.hasValidated = true

  return errors
}

// @ts-expect-error fuck vue types
watch(() => formData[currentStep.value], value => validateForm(value))

function next() {
  // @ts-expect-error fuck vue types
  if (!formState.value.hasValidated && validateForm(formData[currentStep.value], true) !== null || formState.value.errors !== null)
    return

  if (disableNext.value) {
    const value = toRaw(formData)

    emits('submit', value as TWizardFormData)

    return
  }

  currentStep.value = steps[currentStepIndex.value + 1]
}

function previous() {
  if (disablePrevious.value)
    return

  const previousStep = steps[currentStepIndex.value - 1]

  currentStep.value = previousStep
}

const slots = useSlots()

// 1. ensure slots
onBeforeMount(() => {
  (steps as string[]).forEach((it) => {
    if (slots[it] === undefined)
      throw new Error(`${it} slot is not provided`)
  })
})

const containerRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div v-bind="$attrs" ref="containerRef">
    <template v-for=" [__stepKey, __stepRenderFn] in Object.entries($slots)" :key="__stepKey">
      <template
        v-if="
          !INTERNAL_SLOTS.includes(__stepKey as any)
            && __stepRenderFn !== undefined
            && currentStep === __stepKey
        "
      >
        <!-- @vue-ignore -->
        <component :is="() => __stepRenderFn({ state: _formAccessors[__stepKey ], errors: formState.errors ?? {} })" />
      </template>
    </template>

    <slot name="navigation" :next="next" :previous="previous">
      <ElButton :disabled="disablePrevious" @click="previous">
        Previous
      </ElButton>

      <ElButton @click="next">
        {{ disableNext ? 'Submit' : 'Next' }}
      </ElButton>
    </slot>
  </div>
</template>
