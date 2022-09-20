import { unref, defineComponent, FunctionalComponent, isProxy, type PropType, ExtractPropTypes } from 'vue';
import ProField from '@ant-design-vue/pro-field';
import ProFormItem from '../FormItem';
import { useGridHelpers } from '../../helpers';
import { useFormInstance } from '../../BaseForm/hooks/useFormInstance';
import { pick } from 'lodash-es';
import { proFieldProps } from '@ant-design-vue/pro-field';
import { proFormGridConfig, extendsProps, type FieldProps } from '../../typings';
import { proFormItemProps } from '../FormItem';

type NameType = string | number;

export const proFormFieldProps = {
  ...proFieldProps,
  ...pick(proFormGridConfig, 'colProps'),
  ...proFormItemProps,
  ...extendsProps,
  fieldProps: {
    type: Object as PropType<FieldProps & Record<string, any>>,
  },
};

export type ProFormFieldProps = Partial<ExtractPropTypes<typeof proFormFieldProps>>;

const ProFormField = defineComponent({
  name: 'BaseProFormField',
  inheritAttrs: false,
  props: proFormFieldProps,
  setup(props) {
    const formContext = useFormInstance();
    return () => {
      const valueType = props.valueType || 'text';
      const FormItem: FunctionalComponent = () => {
        return (
          <ProFormItem
            v-slots={{
              default: () => (
                <ProField
                  {...props}
                  valueType={valueType}
                  mode={formContext.getFormProps.value.readonly ? 'read' : 'edit'}
                  fieldProps={{
                    ...props.fieldProps,
                    'onUpdate:value'(value: any) {
                      // 更新form的model数据
                      (formContext.model.value || {})[props.formItemProps?.name as NameType] = value;
                    },
                  }}
                  formItemProps={{
                    ...props.formItemProps,
                    model: formContext.model.value,
                  }}
                />
              ),
            }}
            {...props.formItemProps}
          />
        );
      };
      const { ColWrapper } = unref(useGridHelpers({ colProps: props.colProps }));
      return <ColWrapper>{FormItem}</ColWrapper>;
    };
  },
});

export default ProFormField;