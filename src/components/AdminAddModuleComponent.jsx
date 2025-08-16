"use client"

export default function AdminAddModuleComponent({onModuleSubmitted}) {

    return <form action={onModuleSubmitted}>
        <h3>Add Module</h3>
        Module code: <br />
        <input id='moduleCode' name='moduleCode' type='text' /><br />
        Module name: <br />
        <input id='moduleName' name='moduleName' type='text' style={{width:"400px"}}/><br />
        <input type='submit' value='Go!' />
        </form>;
}
