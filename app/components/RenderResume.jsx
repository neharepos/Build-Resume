import React from 'react'
import TemplateOne from './TemplateOne'
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree'

const RenderResume = ({
    templateId,
    resumeData,
    containerWidth,
}) => {
    const colorPalette = [
        "#ffffff", // 0: Background
        "#1e293b", // 1: Text primary
        "#64748b", // 2: Text secondary
        "#8b5cf6", // 3: Accent primary (Violet)
        "#f1f5f9", // 4: Background secondary
    ];

    switch(templateId){
    case "01":
        return(
            <TemplateOne resumeData={resumeData} colorPalette={colorPalette} containerWidth={containerWidth}/>
        )

    case "02":
        return(
            <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} />
        )

    case "03":
        return(
            <TemplateThree resumeData={resumeData} containerWidth={containerWidth}/>
        )
    default: 
        return(
            <TemplateOne resumeData={resumeData} containerWidth={containerWidth}/>
    )
 }
 
}

export default RenderResume