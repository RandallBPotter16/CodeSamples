import React from 'react';
import Header from '../common/page-header';
import ToggleSwitchCustom from '../ui/form-controls/toggle-switch-custom';


// import components from React-Bootstrap
import {Grid, Row, Col, Panel} from 'react-bootstrap';

class SamplePage extends React.Component {

  render() {
    return (
      <div>

        <Header pageTitle="Add-ons Page" breadcrumbs={[]}>
        </Header>

        <Grid fluid={true}>
          <Row>
            <Col md={12}>
              <Panel>
                  <p>Custom Toggle Switch</p>
                  <ToggleSwitchCustom>view-edit</ToggleSwitchCustom>
                  <pre>
                      &lt;ToggleSwitchCustom name="toggle_switch"&gt;<br/>
                      &nbsp;&nbsp;offstateword-onstateword<br/>
                      &lt;/ToggleSwitchCustom&gt;<br /><br />
                      Example:<br />
                      &lt;ToggleSwitchCustom name="toggle_switch"&gt;<br/>
                      &nbsp;&nbsp;view-edit<br/>
                      &lt;/ToggleSwitchCustom&gt;<br />
                  </pre>
              </Panel>
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }

}

export default SamplePage;
