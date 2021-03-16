<template>
  <div>
    <v-card outlined id='container' :style='svgContainerCSS'>
      <svg id='d3svg' class='svg-content'>
        {{drawGraph}}
      </svg>
    </v-card>
  </div>
</template>

<script>
import * as d3 from 'd3'
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')

export default {
  name: 'Graph',
  props: ['elem', 'results'],
  data () {
    return {
      defaultNamespace: '',
      defaultNamespaceForQuery: '',
      height: 400,
      width: 800,
      collisionStrength: 0.7,
      nodeRadius: 30,
      linkDistance: 100,
      lineWidth: 10
    }
  },
  mounted: async function () {
    // await this.getDefaultNamespace(this.$session.get('repoID'))

    // var bool = await this.isIndividual(':c600')
    // console.log(bool.data)
  },
  methods: {
    async getDefaultNamespace (repoID) {
      var response = await axios.get(this.backendURL + '/api/rdf4j/repository/' + repoID + '/namespaces/ /')
      this.defaultNamespace = response.data
      this.defaultNamespaceForQuery = 'PREFIX : <' + response.data + '>\n'
      return this.defaultNamespaceForQuery
    },
    async isIndividual (resource) {
      // ASK query - check if it is a owl:NamedIndividual
      const gotHash = resource.includes('#')
      if (gotHash) resource = '<' + resource + '>'
      const query = this.defaultNamespaceForQuery + 'ASK { ' + resource + ' rdf:type owl:NamedIndividual. }'
      console.log(query)
      var repoID = this.$repo.id
      var url = this.backendURL + '/api/rdf4j/query/' + repoID
      const config = {
        headers: {
          Accept: 'text/boolean',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      return await axios.post(url, qs.stringify({ query: query, infer: true }), config)
    },
    drag (simulation) {
      function dragstarted (d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }
      function dragged (d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function dragended (d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    color (d) {
      // const scale = d3.scaleOrdinal(d3.schemeCategory10)
      // console.log(d.group)
      // console.log(scale(d.group))
      // return scale(d.group)

      // console.log(d3.schemeCategory10[d.group])
      return d3.schemeCategory10[d.group]
    }
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo
    },
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl
    },
    backendURL: function () {
      var backendURL = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backendURL
    },
    svgContainerCSS () {
      const paddingBottom = (this.svgSize.ratio * 100).toString() + '%'
      return {
        display: 'inline-block',
        position: 'relative',
        width: '100%',
        'padding-bottom': paddingBottom,
        'vertical-align': 'top',
        overflow: 'hidden'
      }
    },
    svgSize: function () {
      var width = 800 // default: 800
      var height = 400 // default: 400
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          width = 400
          height = 600
          break
        case 'sm':
          width = 500
          height = 600
          break
        case 'md':
          width = 600
          height = 600
          break
        case 'lg':
          width = 800
          height = 600
          break
        case 'xl':
          width = 1200
          height = 600
          break
      }
      var ratio = height / width // default: 50%
      // console.log(width, height, ratio)
      return { width, height, ratio }
    },
    parseResults () {
      // console.log(this.elem)
      // console.log(this.results)
      var nodes = []
      var nodesAux = {}
      nodesAux[this.elem] = 1
      // var isIndiv = await this.isIndividual(':c600')
      // console.log(isIndiv.data)
      // if (isIndiv) nodesAux[this.elem] = 0
      // else nodesAux[this.elem] = 1;

      this.results.forEach(elem => {
        // FIXME: needs improvements
        // FIXME: double check Literals for bugs
        if (elem.subject) {
          if (!nodesAux[elem.subject.value]) {
            if (elem.subject.type === 'uri') nodesAux[elem.subject.value] = 1
            else nodesAux[elem.subject.value] = 2
          }
        }
        if (elem.object) {
          if (!nodesAux[elem.object.value]) {
            if (elem.object.type === 'uri') nodesAux[elem.object.value] = 1
            else nodesAux[elem.object.value] = 2
          }
        }
      })
      for (const id in nodesAux) {
        const value = nodesAux[id]
        nodes.push({ id: id, group: value })
      }

      var links = []
      this.results.forEach(elem => {
        // FIXME: needs improvements
        var source = this.elem
        var target = this.elem
        if (elem.subject) source = elem.subject.value
        if (elem.object) target = elem.object.value
        links.push({ source: source, target: target, value: this.lineWidth })
      })

      return { nodes, links }
    },
    drawGraph () {
      var results = this.parseResults
      var nodes = results.nodes
      var links = results.links

      var svgSize = this.svgSize
      const width = svgSize.width
      const height = svgSize.height

      const simulation = d3.forceSimulation(nodes)
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(this.nodeRadius).strength(this.collisionStrength))
        .force('link', d3.forceLink(links).id(d => d.id).distance(this.linkDistance))
        .force('charge', d3.forceManyBody())
        // TODO: add click for navigation
        // TODO: add scrool zoom

      const svg = d3.select('#d3svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${width} ${height}`)

      // clear existing svg content (prevents redraw overlap)
      svg.selectAll('*').remove()

      const link = svg.append('g')
        .attr('stroke', '#2196F3')
        .attr('stroke-opacity', 0.8)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value))

      const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .call(this.drag(simulation))

      node.append('circle')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('r', this.nodeRadius)
        .attr('fill', d => this.color(d))

      node.append('text')
        .attr('font-size', '0.8em')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('dy', 5)
        .text(d => d.id)

      simulation.on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
        node.attr('transform', d => `translate(${d.x}, ${d.y})`)
      })

      // invalidation.then(() => simulation.stop())
      return svg.node()
    }
  }
}
</script>

<style>
/* .svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 50%;
  vertical-align: top;
  overflow: hidden;
} */
.svg-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
