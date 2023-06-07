export type CategoryInfoType =
  {
    id: string,
    name: CategoryName,
    url: string,
    check?: boolean
  }

export enum CategoryName{
  copywriting = 'Копирайтинг',
  target = 'Таргет',
  SMM = 'SMM',
  design = 'Дизайн',
  freelance = 'Фриланс'
}
