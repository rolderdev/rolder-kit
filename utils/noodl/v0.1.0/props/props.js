import sharedProps from "./shared"
const {
  size, color, notificationsPosition, detectColorScheme, colorScheme, loaderVariant, stackAlign, stackJustify, spacing, avatarVariant, radius, iconName,
  sizeUnits, stroke, shadow, value, useDataType, useDataEnabled, className, setRefs, refMap, query, sorts, options, id, ids, bottomOffset, flexAlign,
  flexJustify, gap, opacity, direction, wrap, withBorder, position, grow, disabled, authenticated, isLoading, sendLoaded, sendSelected, actionVariant,
  iconSize, sendClicked, title, message, autoClose, updateItem, isUpdating, sendUpdated, drawerPosition, sizeString, show, withCloseButton, sendSubmited,
  selectedValue, sendInited, gutter, spans, label, placeholder, withAsterisk, classNames, searchString, searchFields, foundedData, inputString, orientation,
  inputItems, searchEnabled, selectedItem, sendViewItem, sendEditItem, selectedItems, selectedPath, pathChanged, offsetScrollbars, badgeVariant, labelField,
  isDeleting, sendDeleted, formScheme, searchable, clearable, dateFormat, limitMinDate, daysOffset, createItem, isCreating, sendCreated, sendHided, debounced,
  delay, isUploading, sendUploaded, uploadedUrls, screenshot, sendScreenshot, creatable, doCreate, createValue, createdItem, buttonType, selectFirstItem,
  resetSelected, doDelete, createData, createdItems, qrCodeLevel, doViewImages,
} = sharedProps
import groupedProps from "./grouped"
const { sxBgColor, sxDimensions, margins, dimensions, paddings, font, auth, form, Table, ETable, AppShell, uploadFiles } = groupedProps

const props = {
  initBackend: {
    '0.1.0': {
      outs: { ...auth }
    }
  },
  App: {
    '0.1.0': {
      ins: { notificationsPosition, detectColorScheme, colorScheme },
      outs: { ...auth },
    },
    '0.2.0': {
      ins: { notificationsPosition, detectColorScheme, colorScheme },
      outs: { sendInited },
    },
  },
  auth: {
    '0.1.0': {
      ins: { ...margins, ...paddings, ...dimensions, shadow, stackSpacing: { ...spacing }, buttonColor: { ...color } },
      outs: { authenticated },
    }
  },
  useData: {
    '0.1.1': {
      ins: { useDataType, useDataEnabled, className, setRefs, refMap, query, sorts, options, id, ids },
      outs: { isLoading, sendLoaded },
      dyn: [
        { condition: 'setRefs = true', inputs: ['refMap'] },
        { condition: 'useDataType = fetch', inputs: ['query', 'sorts', 'options'] },
        { condition: 'useDataType = get', inputs: ['id'] },
        { condition: 'useDataType = mGet', inputs: ['ids'] },
      ],
    }
  },
  useSearch: {
    '0.1.0': {
      ins: { classNames, searchString, searchFields, options },
      outs: { foundedData, isLoading, sendLoaded },
    }
  },
  UseSearch: {
    '0.1.1': {
      ins: { classNames, searchString, searchFields, options },
      outs: { foundedData, isLoading, sendLoaded },
    }
  },
  create: {
    '0.1.0': {
      ins: { createItem },
      outs: { isCreating, sendCreated, createdItem },
    }
  },
  mCreate: {
    '0.1.0': {
      ins: { createData },
      outs: { isCreating, sendCreated, createdItems },
    }
  },
  update: {
    '0.1.0': {
      ins: { updateItem },
      outs: { isUpdating, sendUpdated },
    }
  },
  mDelete: {
    '0.1.0': {
      ins: { className, ids },
      outs: { isDeleting, sendDeleted },
    }
  },
  uploadWebCamShots: {
    '0.1.0': {
      ins: { ...uploadFiles },
      outs: { isUploading, sendUploaded, uploadedUrls },
    }
  },
  loader: {
    '0.1.0': {
      ins: { ...margins, color, size, variant: loaderVariant }
    }
  },
  box: {
    '0.1.0': {
      ins: { ...sxDimensions, opacity }
    }
  },
  stack: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...paddings, align: stackAlign, justify: stackJustify, spacing, opacity }
    }
  },
  flex: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...paddings, align: flexAlign, justify: flexJustify, gap, opacity, direction, wrap }
    }
  },
  group: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...paddings, position, grow, spacing }
    }
  },
  Group: {
    '0.2.0': {
      ins: { ...margins, ...dimensions, ...paddings, position, grow, spacing, opacity }
    }
  },
  grid: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...paddings, gutter, spans },
    }
  },
  center: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...paddings }
    }
  },
  Carousel: {
    '0.1.0': {
      ins: {}
    }
  },
  avatar: {
    '0.1.0': {
      ins: { ...margins, variant: avatarVariant, size, radius, color }
    }
  },
  icon: {
    '0.1.0': {
      ins: { ...margins, size: { ...sizeUnits }, iconName, stroke, color }
    }
  },
  Image: {
    '0.1.0': {
      ins: { ...margins, src: {...value} }
    }
  },
  text: {
    '0.2.1': {
      ins: { ...margins, ...font, c: { ...color }, value },
    }
  },
  scrollArea: {
    '0.1.0': {
      ins: { w: { ...dimensions.w }, bottomOffset, offsetScrollbars },
    }
  },
  paper: {
    '0.1.0': {
      ins: { ...margins, ...paddings, shadow, radius, withBorder, ...sxBgColor }
    }
  },
  paperButton: {
    '0.1.0': {
      ins: { ...margins, ...paddings, shadow, radius, withBorder },
      outs: { sendSelected }
    }
  },
  button: {
    '0.1.0': {
      ins: { ...margins, ...paddings, disabled, size, radius, color, iconSize, iconName, isLoading, variant: { ...actionVariant }, value },
      outs: { sendClicked }
    }
  },
  Button: {
    '0.1.1': {
      ins: { ...margins, ...paddings, disabled, size, radius, color, iconSize, iconName, isLoading, variant: { ...actionVariant }, value, buttonType },
      outs: { sendClicked }
    }
  },
  actionIcon: {
    '0.1.0': {
      ins: { ...margins, ...paddings, disabled, size, radius, color, iconSize, iconName, isLoading, variant: { ...actionVariant } },
      outs: { sendClicked }
    }
  },
  notification: {
    '0.1.0': {
      ins: { title, message, autoClose, color }
    }
  },
  drawer: {
    '0.1.0': {
      ins: { position: drawerPosition, title, size: { ...sizeString }, show, withCloseButton },
      outs: { sendHided }
    }
  },
  Modal: {
    '0.1.0': {
      ins: { title, size: { ...sizeString }, show, withCloseButton },
      outs: { sendHided }
    }
  },
  webCamera: {
    '0.1.0': {
      outs: { screenshot, sendScreenshot }
    }
  },
  QRCode: {
    '0.1.0': {
      ins: { value, size: { ...sizeUnits }, level: qrCodeLevel }
    }
  },
  textInput: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...form, label, placeholder, withAsterisk, disabled, radius, iconSize, iconName },
      outs: { inputString },
      dyn: [{ condition: "useForm = true", inputs: ["formField"] }]
    },
  },
  TextInput: {
    '0.2.0': {
      ins: { ...margins, ...dimensions, ...form, label, placeholder, withAsterisk, disabled, radius, iconSize, iconName, debounced, delay },
      outs: { inputString },
      dyn: [{ condition: "useForm = true", inputs: ["formField"] }, { condition: "debounced = true", inputs: ["delay"] }]
    }
  },
  Textarea: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...form, label, placeholder, withAsterisk, disabled, radius },
    }
  },
  SegmentedControl: {
    '0.1.0': {
      ins: { ...margins, ...dimensions, ...form, value, color, size, disabled, orientation, inputItems, radius },
      outs: { selectedValue },
      dyn: [{ condition: "useForm = true", inputs: ["formField"] }]
    }
  },
  Table: {
    '0.1.0': {
      ins: { ...margins, ...Table, ...sxDimensions, shadow, foundedData, searchEnabled },
      outs: { selectedItem, sendSelected },
      dyn: [
        { condition: 'selectable = true', inputs: ['selectableType'] },
        { condition: 'selectable = true && selectableType = singleRow', inputs: ['highlightOnHover', 'highlightSelectedRow'] }
      ],
    },
    '0.2.0': {
      ins: { ...margins, ...Table, ...sxDimensions, shadow, foundedData, searchEnabled, selectFirstItem, resetSelected },
      outs: { selectedItem, sendSelected, doDelete },
      dyn: [
        { condition: 'selectable = true', inputs: ['selectableType'] },
        { condition: 'selectable = true && selectableType = singleRow', inputs: ['selectFirstItem', 'highlightOnHover', 'highlightSelectedRow'] }
      ],
    },
  },
  ETable: {
    '0.1.0': {
      ins: { ...margins, ...ETable, ...sxDimensions, shadow, foundedData, searchEnabled },
      outs: { selectedItem, sendViewItem, sendEditItem, selectedItems },
    },
    '0.1.1': {
      ins: { ...margins, ...ETable, ...sxDimensions, shadow, foundedData, searchEnabled },
      outs: { selectedItem, sendViewItem, sendEditItem, selectedItems, doViewImages },
    },
  },
  AppShell: {
    '0.1.0': {
      ins: { ...AppShell, navbarWidth: { ...dimensions.w }, headerHeight: { ...dimensions.h } },
      outs: { selectedPath, pathChanged },
      dyn: [
        { condition: 'enableHeader = true', inputs: ['headerHeight'] },
        { condition: 'enableNavbar = true', inputs: ['navbarWidth'] },
      ],
    },
  },
  Badge: {
    '0.1.0': {
      ins: { ...margins, variant: badgeVariant, size, radius, color, value, iconName, iconSize }
    }
  },
  CheckboxGroup: {
    '0.1.0': {
      ins: { ...margins, ...form, inputItems, direction, color, size, spacing, grow, value, disabled },
      dyn: [{ condition: "useForm = true", inputs: ["formField"] }]
    }
  },
  Select: {
    '0.1.0': {
      ins: { ...margins, ...form, inputItems, label, placeholder, withAsterisk, disabled, radius, value, labelField, searchable, clearable },
      outs: { sendSelected },
    },
    '0.2.0': {
      ins: { ...margins, ...form, inputItems, label, placeholder, withAsterisk, disabled, radius, value, labelField, searchable, clearable, creatable },
      outs: { sendSelected, doCreate, createValue },
    }
  },
  MultiSelect: {
    '0.1.0': {
      ins: { ...margins, ...form, inputItems, label, placeholder, withAsterisk, disabled, radius, value, labelField, searchable, clearable },
      outs: { sendSelected },
    }
  },
  PopoverButton: {
    '0.1.0': {
      ins: { ...margins, variant: { ...actionVariant }, size, radius, color, shadow, iconSize, disabled, iconName, value },
      outs: { sendClicked }
    }
  },
  Form: {
    '0.1.0': {
      ins: { formScheme },
      outs: { formHook: { ...form.formHook }, sendSubmited }
    }
  },
  DateTimePicker: {
    '0.1.0': {
      ins: { ...margins, ...form, label, placeholder, withAsterisk, disabled, radius, dateFormat, limitMinDate, daysOffset },
      dyn: [{ condition: "useForm = true", inputs: ["formField"] }, { condition: "limitMinDate = true", inputs: ["daysOffset"] }]
    },
  }
}

export default props