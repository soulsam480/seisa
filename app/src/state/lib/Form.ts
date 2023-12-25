/**
 * form handles the logic for updating and inserting models
 * a form can be created form a model or a from
 */
export abstract class Form<Model = unknown, NewModel = unknown> {
  /**
   * returns a payload for updating the model
   * this is used for updating the model in the database
   */
  abstract get_model_update_payload(): Partial<Model>

  /**
   * returns a payload for inserting a row
   * this directly inserts a row into the database
   */
  abstract get_insert_payload(): NewModel

  /**
   * because of vue's reactivity, nested ref's are not unwrapped
   * we have to clone the form to get the raw values
   */
  clone() {
    return new (this.constructor as any)(this)
  }
}
