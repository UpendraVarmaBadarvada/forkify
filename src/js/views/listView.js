import { fields } from './base';

export const renderItem = item => {
    const markup=`
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping_count_value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    fields.shopping_list.insertAdjacentHTML('beforeend',markup);
}


//delete the item from shopping list in ui
export const deleteItem = id =>{

    const item= document.querySelector(`[data-itemid="${id}"]`);
    item.parentNode.removeChild(item);

}