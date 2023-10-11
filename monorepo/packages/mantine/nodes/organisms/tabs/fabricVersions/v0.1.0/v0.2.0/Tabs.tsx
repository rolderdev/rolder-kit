import { Tabs } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks";
import { forwardRef, useState } from "react"

export default forwardRef(function (props: any) {
    const [activeTab, setActiveTab] = useState<string | null>();
    useShallowEffect(() => setActiveTab(props.value), [props.value])
    return <Tabs
        {...props}
        value={activeTab}
        onTabChange={setActiveTab}
        variant={props.tabsVariant}
        orientation={props.tabsOrientation}
    >
        <Tabs.List
            {...props}
            position={props.tabsPosition}
            grow={props.grow}
        >
            {props.children}
        </Tabs.List>
    </Tabs>
})