import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"




export default ({ employee, updateEmployees }) => {
    
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const history = useHistory()

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
                    employeeId
                        ? <>
                            <section>
                            {
                                (resource.animals > 0)
                                ?  <p>Caring for {resource.animals?.length}</p> 
                                : <p>Not currently caring for any animals</p>
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
                    employeeId
                        ? <>
                           <button className="btn--fireEmployee" onClick={() => {
                        EmployeeRepository.delete(employeeId).then(() => EmployeeRepository.getAll().then(history.push("/employees"))
                        )
                    }}>Fire</button>
                        </>
                        : <button className="btn--fireEmployee" onClick={() => {
                            EmployeeRepository.delete(employee.id).then(() => EmployeeRepository.getAll().then(updateEmployees)
                            )
                        }}>Fire</button>
                    
                }

                {/* {
                    <button className="btn--fireEmployee" onClick={() => {
                        EmployeeRepository.delete(employee.id).then(() => EmployeeRepository.getAll().then(updateEmployees)
                        )
                    }}>Fire</button>
                } */}

            </section>

        </article>
    )
}
