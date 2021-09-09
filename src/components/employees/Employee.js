import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"


export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource.employeeLocations[0])
        }
    }, [resource])

    
    return (    
        <article className={classes}>
        <section className="card-body">
            <img alt="Kennel employee icon" src={person} className="icon--person" />
            <h5 className="card-title">
                {
                    employeeId
                        ? resource.name
                        : <Link className="card-link"
                            to={{
                                pathname: `/employees/${resource.id}`,
                                state: { employee: resource }
                            }}>
                            {resource.name}
                        </Link>

                }
            </h5>
               
               {
                   <section>
                    Caring for {employee?.animalCaretakers?.length} animals
                   </section>
                   
               }
                {
                    employeeId
                        ? <>
                            <section>
                            {
                                (resource.animals?.length > 0)
                                ?  <p>Caring for {resource.animals?.length} animals</p> 
                                : <p>Not caring for any animals</p>
                            }         
                            </section>
                            <section>
                            {
                                (resource.locations && resource.locations.length === 1) 
                                ? <p>Working at {resource.locations[0]?.location?.name}</p> 
                                : (resource.locations && resource.locations.length > 1)
                                ?  <p>Working at both {resource.locations[0]?.location?.name} and {resource.locations[1]?.location?.name}</p>
                                : <p>Not currently working</p>
                            }
                                
                            </section>
                        </>
                        : ""
                }

                {
                    <button className="btn--fireEmployee" onClick={() => {}}>Fire</button>
                }

            </section>

        </article>
    )
}
