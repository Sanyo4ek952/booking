export type AmenityCategory = {
  id: string;
  title: string;
  items: AmenityItem[];
};

export type AmenityItem = {
  id: string;
  label: string;
};

export const amenityCategories: AmenityCategory[] = [
  {
    id: "basic",
    title: "Основные удобства",
    items: [
      { id: "basic-wifi", label: "Беспроводной интернет Wi-Fi" },
      { id: "basic-tv", label: "Телевизор" },
      { id: "basic-kettle", label: "Электрический чайник" },
      { id: "basic-hair-dryer", label: "Фен" },
      { id: "basic-microwave", label: "Микроволновка" },
      { id: "basic-washing-machine", label: "Стиральная машина" },
      { id: "basic-fridge", label: "Холодильник" },
    ],
  },
  {
    id: "kitchen",
    title: "Кухонное оборудование",
    items: [
      { id: "kitchen-microwave", label: "Микроволновка" },
      { id: "kitchen-water-filter", label: "Фильтр для воды" },
      { id: "kitchen-dishes", label: "Посуда и принадлежности" },
      { id: "kitchen-cutlery", label: "Столовые приборы" },
      { id: "kitchen-kettle", label: "Электрический чайник" },
      { id: "kitchen-fridge", label: "Холодильник" },
      { id: "kitchen-bar-counter", label: "Барная стойка" },
      { id: "kitchen-set", label: "Кухонный гарнитур" },
    ],
  },
  {
    id: "bathroom",
    title: "Ванная комната",
    items: [
      { id: "bathroom-toilet", label: "1 ванная комната с туалетом" },
      { id: "bathroom-towels", label: "Полотенца" },
      { id: "bathroom-toiletries", label: "Туалетные принадлежности" },
      { id: "bathroom-hair-dryer", label: "Фен" },
      { id: "bathroom-shower", label: "Душ" },
      { id: "bathroom-slippers", label: "Тапочки" },
    ],
  },
  {
    id: "equipment",
    title: "Оснащение",
    items: [
      { id: "equipment-washing-machine", label: "Стиральная машина" },
      { id: "equipment-wifi", label: "Беспроводной интернет wi-fi" },
      { id: "equipment-dryer", label: "Сушилка для белья" },
      { id: "equipment-heating", label: "Центральное отопление" },
      { id: "equipment-fan", label: "Вентилятор" },
      { id: "equipment-iron", label: "Утюг с гладильной доской" },
      { id: "equipment-water-heater", label: "Водонагреватель" },
      { id: "equipment-mosquito-net", label: "Москитная сетка" },
      { id: "equipment-living-area", label: "Гостиный уголок" },
      { id: "equipment-cleaning", label: "Чистящие средства" },
      { id: "equipment-heater", label: "Обогреватель" },
      { id: "equipment-laminate", label: "Ламинат" },
      { id: "equipment-hangers", label: "Вешалка для одежды" },
    ],
  },
  {
    id: "indoor-rest",
    title: "Для отдыха в помещении",
    items: [
      { id: "indoor-tv", label: "Телевизор" },
      { id: "indoor-satellite-tv", label: "Спутниковое ТВ" },
      { id: "indoor-smart-tv", label: "Смарт ТВ" },
    ],
  },
  {
    id: "nearby",
    title: "Инфраструктура и досуг рядом",
    items: [
      { id: "nearby-cinema", label: "Кинотеатр" },
      { id: "nearby-theater", label: "Театр" },
      { id: "nearby-nightclub", label: "Ночной клуб" },
      { id: "nearby-spa", label: "Spa-центр" },
    ],
  },
  {
    id: "view",
    title: "Вид из окна",
    items: [{ id: "view-yard", label: "Во двор" }],
  },
  {
    id: "accessibility",
    title: "Доступность",
    items: [{ id: "accessibility-first-floor", label: "Находится на первом этаже" }],
  },
];

export const amenityItems = amenityCategories.flatMap((category) => category.items);

export function getAmenityLabel(value: string) {
  return amenityItems.find((item) => item.id === value)?.label ?? value;
}

export function getSelectedAmenityCategories(values: string[]) {
  const selected = new Set(values);
  const selectedLabels = new Set(values.map((value) => value.toLowerCase()));

  return amenityCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => selected.has(item.id) || selectedLabels.has(item.label.toLowerCase())),
    }))
    .filter((category) => category.items.length > 0);
}
