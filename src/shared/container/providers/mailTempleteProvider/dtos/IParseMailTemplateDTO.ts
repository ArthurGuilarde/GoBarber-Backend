interface IVariables {
  [key: string]: string | number;
}
export default interface IParseMailTemplateDTO {
  template: string;
  variables: IVariables;
}
