export class UtilsGrid {
    /**
     * Metodo que permite ordenar una fila en forma ascendente
     * @param lstItems
     * @param selectedItem
     * @param index
     */
    public static upRowClick(lstItems: any, selectedItem: any, index: number) {
        // get index of item selected
        const getIndex = lstItems.indexOf(selectedItem);
        if (getIndex > 0) {
            lstItems.splice(getIndex, 1);
            lstItems.splice(getIndex - 1, 0, selectedItem);
            index = getIndex;
            return index;
        }
    }

    /**
     * Metodo que permite ordenar una fila en forma descendente
     * @param lstItems
     * @param selectedItem
     * @param index
     */
    public static downRowClick(lstItems: any, selectedItem: any, index: number) {
        // get index of item selected
        const getIndex = lstItems.indexOf(selectedItem);
        if (getIndex < lstItems.length - 1) {
            lstItems.splice(getIndex, 1);
            lstItems.splice(getIndex + 1, 0, selectedItem);
            index = getIndex + 2;
        }
        return index;
    }

    /**
     * Metodo que permite eliminar un elemento de la lista
     * @param lstItems
     * @param selectedItem
     */
    public static removeRowClick(lstItems: any, selectedItem: any) {
        if (lstItems.indexOf(selectedItem) > -1) {
            lstItems.splice(lstItems.indexOf(selectedItem), 1);
        }
    }
}
