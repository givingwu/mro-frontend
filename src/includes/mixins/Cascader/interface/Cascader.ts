interface Cascader {
  constructor(options: CascaderOptions): Cascader;
  state: CascaderState;

  /* Cache Pool System within JS heap */
  cachedElementsPool: Array<Element>;
  /* get cached element by special data item or element id */
  getCachedElements(id: number): Element | null;
  /* max cached element length is a configurable option, default is 10 */
  setCachedElements(id: number, element: Element): Element;

  // init data by current state value
  loadData(id: TreeData['value']): Array<TreeData>;

  // render layout
  renderLayout();

  bindEvents();
    clickItem(index, value);
      checkDoesItHasNextPanel(index): boolean;
        updateHeadPanelText(text: string); // the text content of current active item
        updateActiveByIndex(nextIndex: CascaderState['activeIndex']);
          updateNextHeadPanelText(text: string); // '请选择'
          updateNextBodyPanelText(text: string); // 加载数据中
            checkDoesItLoadedBefore(id: TreeData['value']): Element;
              loadNextPanelDataByValue(id: TreeData['value']): Array<TreeData>; // 加载子 panel data
                updateNextPanelText(data: TreeData[]);
            updateNextPanelText(Element);
            updateCurrentStateValue()
      updateCurrentStateValue()
}

interface CascaderOptions {
  value: CascaderState['value'];
  data: Array<TreeData>;
  cachedElementsStackLength: 10;
}

interface CascaderState {
  value: string | number;
  data: Array<TreeData>;
  activeIndex: number;
}

interface TreeData {
  label: string;
  value: number;
  children?: Array<TreeData>;
}
